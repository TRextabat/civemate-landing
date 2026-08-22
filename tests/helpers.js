// Minimal Vercel-Node-runtime-shaped req/res doubles — no framework, no
// mocking library, matching the actual call surface `api/a/[id].js` uses
// (`res.status().setHeader().send()`, `req.query`, `req.headers`). Kept in
// one place so every test file exercises the exact same fake, not slightly
// different ad-hoc ones.

export function makeRes() {
  const res = {
    statusCode: undefined,
    headers: {},
    body: undefined,
    status(code) {
      res.statusCode = code
      return res
    },
    setHeader(key, value) {
      res.headers[key] = value
      return res
    },
    send(body) {
      res.body = body
      return res
    },
  }
  return res
}

export function makeReq({ id, acceptLanguage } = {}) {
  return {
    query: { id },
    headers: acceptLanguage ? { 'accept-language': acceptLanguage } : {},
  }
}

// Swaps `global.fetch` for the duration of a test and restores the real one
// afterwards, even if the test throws. The handler under test is always the
// real module, unmocked — only the outbound network call to `api.civemate.
// com` (currently unreachable: dev VM down) is stubbed, which is the actual
// boundary of this repo (a serverless function calling a separate service),
// not a bypass of the code path being verified.
export async function withFetch(fakeFetch, fn) {
  const real = global.fetch
  global.fetch = fakeFetch
  try {
    await fn()
  } finally {
    global.fetch = real
  }
}
