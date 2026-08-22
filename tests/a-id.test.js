import { test } from 'node:test'
import assert from 'node:assert/strict'

import handler from '../api/a/[id].js'
import { makeReq, makeRes, withFetch } from './helpers.js'

const VALID_ID = '11111111-2222-3333-4444-555555555555'
const MALFORMED_ID = 'not-a-uuid'

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  }
}

test('renders og tags in the raw body for a valid activity, including the date', async () => {
  const res = makeRes()
  await withFetch(
    async () =>
      jsonResponse(200, {
        id: VALID_ID,
        title: 'Kadıköy Jam Session',
        description: 'Bring your own instrument.',
        cover_url: 'https://media.civemate.com/media/m1/standard.webp',
        start_time: '2026-09-12T18:00:00Z',
        city: 'Istanbul',
        organiser_display_name: 'Ada',
      }),
    async () => {
      await handler(makeReq({ id: VALID_ID }), res)
    },
  )

  assert.equal(res.statusCode, 200)
  assert.match(res.body, /<meta property="og:title" content="Kadıköy Jam Session"/)
  assert.match(res.body, /<meta property="og:image" content="https:\/\/media\.civemate\.com/)
  assert.match(res.body, /<meta property="og:url" content="https:\/\/app\.civemate\.com\/a\//)
  // start_time (issue #2): rendered in the activity's own local time
  // (Europe/Istanbul, 18:00 UTC -> 21:00 local) and folded into
  // og:description, not just the visible page.
  assert.match(res.body, /21:00/)
  assert.match(res.body, /<meta property="og:description" content="[^"]*21:00[^"]*"/)
  console.log('RENDERED OG BLOCK:\n' + res.body.match(/<meta property="og:[a-z:]+"[^>]*>/g).join('\n'))
})

test('a blank timezone (present but empty) still renders via the Europe/Istanbul fallback', async () => {
  const res = makeRes()
  await withFetch(
    async () =>
      jsonResponse(200, {
        id: VALID_ID,
        title: 'Kadıköy Jam Session',
        description: 'Bring your own instrument.',
        cover_url: null,
        start_time: '2026-09-12T18:00:00Z',
        timezone: '',
        city: 'Istanbul',
        organiser_display_name: 'Ada',
      }),
    async () => {
      await handler(makeReq({ id: VALID_ID }), res)
    },
  )

  assert.equal(res.statusCode, 200)
  // Same 18:00Z start as the fallback-via-missing-field test above: an
  // empty string is falsy, same as undefined, so it degrades to the
  // Europe/Istanbul default (21:00), not to some other/no time.
  assert.match(res.body, /21:00/)
})

test('an explicit non-Istanbul timezone renders a different local time than the fallback would — proves the field is actually used, not ignored', async () => {
  const res = makeRes()
  await withFetch(
    async () =>
      jsonResponse(200, {
        id: VALID_ID,
        title: 'Remote Meetup',
        description: 'Streamed live.',
        cover_url: null,
        start_time: '2026-09-12T18:00:00Z',
        timezone: 'America/New_York',
        city: 'New York',
        organiser_display_name: 'Ada',
      }),
    async () => {
      await handler(makeReq({ id: VALID_ID }), res)
    },
  )

  assert.equal(res.statusCode, 200)
  // Same 18:00Z instant as the Istanbul-fallback tests, but America/New_York
  // is UTC-4 in September (EDT): 18:00Z -> 14:00, not 21:00. If the handler
  // were silently defaulting to Europe/Istanbul regardless of what the API
  // sends, this would (wrongly) also read 21:00.
  assert.match(res.body, /14:00/)
  assert.equal(res.body.includes('21:00'), false)
})

test('escapes an XSS payload in the title (text node and content attribute)', async () => {
  const res = makeRes()
  const payload = '<script>alert(1)</script>'
  await withFetch(
    async () =>
      jsonResponse(200, {
        id: VALID_ID,
        title: payload,
        description: null,
        cover_url: null,
        start_time: null,
        city: null,
        organiser_display_name: null,
      }),
    async () => {
      await handler(makeReq({ id: VALID_ID }), res)
    },
  )

  assert.equal(res.body.includes('<script>alert(1)</script>'), false)
  assert.match(res.body, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/)
})

test('draft/404-from-backend and a malformed id return byte-identical pages (no title leak)', async () => {
  const malformedRes = makeRes()
  await handler(makeReq({ id: MALFORMED_ID }), malformedRes)

  const draftRes = makeRes()
  await withFetch(
    async () => jsonResponse(404, {}),
    async () => {
      await handler(makeReq({ id: VALID_ID }), draftRes)
    },
  )

  assert.equal(malformedRes.statusCode, 404)
  assert.equal(draftRes.statusCode, 404)
  assert.equal(malformedRes.body, draftRes.body)
  assert.equal(draftRes.body.includes(VALID_ID), false)
  console.log('404 PARITY: malformed body === draft body ->', malformedRes.body === draftRes.body)
})

test('a backend that is unreachable produces a distinct 502, never a fake 404', async () => {
  const res = makeRes()
  await withFetch(
    async () => {
      throw new Error('fetch failed (simulated dev-VM-down / api.civemate.com -> 522)')
    },
    async () => {
      await handler(makeReq({ id: VALID_ID }), res)
    },
  )

  const notFoundRes = makeRes()
  await handler(makeReq({ id: MALFORMED_ID }), notFoundRes)

  assert.equal(res.statusCode, 502)
  assert.notEqual(res.statusCode, notFoundRes.statusCode)
  assert.notEqual(res.body, notFoundRes.body)
  console.log(`BACKEND-DOWN STATUS: ${res.statusCode} (not-found control: ${notFoundRes.statusCode})`)
})

test('an Accept-Language: tr request renders the Turkish date tokens', async () => {
  const res = makeRes()
  await withFetch(
    async () =>
      jsonResponse(200, {
        id: VALID_ID,
        title: 'Sahil Konseri',
        description: 'desc',
        cover_url: null,
        start_time: '2026-01-10T18:00:00Z',
        timezone: 'Europe/Istanbul',
        city: 'Izmir',
        organiser_display_name: null,
      }),
    async () => {
      await handler(makeReq({ id: VALID_ID, acceptLanguage: 'tr-TR,tr;q=0.9' }), res)
    },
  )

  assert.match(res.body, /Oca/) // Turkish month abbreviation, not "Jan"
  assert.equal(res.body.includes('Jan'), false)
})
