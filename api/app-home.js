// GET / on app.civemate.com only (vercel.json rewrites "/" -> here when the
// request's Host is app.civemate.com; civemate.com's "/" is untouched and
// keeps serving the marketing SPA from dist/). This subdomain is the app's
// surface, not the marketing landing — a visitor landing here with no
// activity id typically followed a bare share-domain link or an App Link
// that didn't resolve.
import { storeButtonsHtml } from './_lib/render.js'

export default function handler(req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.send(`<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CiveMate</title>
<meta name="robots" content="noindex, follow" />
<style>
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f2e9d8; color: #191713; display: flex; min-height: 100vh; align-items: center; justify-content: center; }
  .wrap { max-width: 480px; padding: 32px 24px; text-align: center; }
  h1 { font-size: 26px; margin-bottom: 8px; }
  .btn { display: inline-block; padding: 12px 20px; margin: 6px; border: 2px solid #191713; border-radius: 999px; text-decoration: none; color: #191713; font-weight: 600; }
  .btn-ghost { border-color: transparent; text-decoration: underline; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>CiveMate</h1>
    <p>This link opens in the CiveMate app. If you shared an activity, use its link directly — otherwise get the app below.</p>
    <div>
      ${storeButtonsHtml()}
    </div>
  </div>
</body>
</html>`)
}
