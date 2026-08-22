import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Regression guard for issue #1: civemate.com is MARKETING ONLY. The /a/:id
// rewrite must be host-scoped to app.civemate.com exactly like the
// assetlinks/app-home rules are, or civemate.com/a/{id} silently serves the
// activity page too.
const vercelConfigPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'vercel.json',
)
const config = JSON.parse(readFileSync(vercelConfigPath, 'utf8'))

test('the /a/:id rewrite is scoped to the app.civemate.com host', () => {
  const rule = config.rewrites.find((r) => r.source === '/a/:id')
  assert.ok(rule, 'expected an /a/:id rewrite rule')
  assert.ok(Array.isArray(rule.has), '/a/:id rewrite must carry a host condition')
  assert.ok(
    rule.has.some((h) => h.type === 'host' && h.value === 'app.civemate.com'),
    '/a/:id must be scoped to app.civemate.com, same as assetlinks/app-home',
  )
})

test('every other app-only rewrite stays scoped to app.civemate.com (no drift)', () => {
  const appOnlySources = ['/.well-known/assetlinks.json', '/']
  for (const source of appOnlySources) {
    const rule = config.rewrites.find((r) => r.source === source)
    assert.ok(rule, `expected a rewrite for ${source}`)
    assert.ok(
      rule.has?.some((h) => h.type === 'host' && h.value === 'app.civemate.com'),
      `${source} must stay scoped to app.civemate.com`,
    )
  }
})
