// GET /a/:id  (routed here via vercel.json rewrite, source path /a/:id ->
// /api/a/:id — Vercel's own file-system routing for api/a/[id].js is
// /api/a/:id, hence the rewrite).
//
// Server-rendered OG unfurl for a share link, backed by the unauthenticated
// GET /activities/{id}/public-preview endpoint (api branch feat/share-og-page,
// commit 175bc31). That endpoint already does all privacy enforcement
// (draft/archived/deleted/non-public -> 404, never 403) — this handler does
// NOT re-implement or widen that policy, it just renders what comes back.
//
// Deliberately never redirects (no 3xx): a blind redirect is invisible to
// social-media unfurlers, which only ever look at the first HTML response.
import { API_BASE_URL, APP_ORIGIN } from '../_lib/config.js'
import { buildActivityPage, buildNotFoundPage, buildErrorPage, resolveLang } from '../_lib/render.js'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const FETCH_TIMEOUT_MS = 5000

function sendHtml(res, status, html, cacheControl) {
  res.status(status)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', cacheControl)
  res.send(html)
}

export default async function handler(req, res) {
  const { id } = req.query
  const canonicalUrl = `${APP_ORIGIN}/a/${encodeURIComponent(String(id ?? ''))}`

  // Malformed id: never worth a round trip to the backend, and treating it
  // any differently from a valid-but-nonexistent id would leak information
  // about which ids are well-formed vs. real.
  if (typeof id !== 'string' || !UUID_RE.test(id)) {
    sendHtml(res, 404, buildNotFoundPage(), 'public, max-age=60')
    return
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  let apiRes
  try {
    apiRes = await fetch(`${API_BASE_URL}/activities/${id}/public-preview`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
  } catch (err) {
    // Network failure / timeout / dev VM down (api.civemate.com -> 522
    // today) — honest degrade, not a fake "not found".
    sendHtml(res, 502, buildErrorPage(), 'no-store')
    return
  } finally {
    clearTimeout(timeout)
  }

  if (apiRes.status === 404) {
    sendHtml(res, 404, buildNotFoundPage(), 'public, max-age=60')
    return
  }

  if (!apiRes.ok) {
    sendHtml(res, 502, buildErrorPage(), 'no-store')
    return
  }

  let activity
  try {
    activity = await apiRes.json()
  } catch {
    sendHtml(res, 502, buildErrorPage(), 'no-store')
    return
  }

  const lang = resolveLang(req.headers['accept-language'])
  const html = buildActivityPage({ activity, canonicalUrl, lang })
  // Short-lived cache: crawlers refetch link previews far less often than
  // users tap the link, and an edited/cancelled activity should stop
  // unfurling with stale info within minutes, not a day.
  sendHtml(res, 200, html, 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400')
}
