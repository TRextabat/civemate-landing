// Shared HTML rendering for the app.civemate.com serverless surface. Kept
// separate from html.js (low-level escaping/truncation) and config.js (env
// reads) so api/a/[id].js and api/app-home.js stay thin request handlers.
import { escapeHtml, truncate } from './html.js'
import {
  APP_ORIGIN,
  FALLBACK_OG_IMAGE,
  STORE_ANDROID_URL,
  STORE_IOS_URL,
} from './config.js'

// "get the app" always resolves somewhere real: a configured store link when
// one exists, the marketing site otherwise. Never a hardcoded/guessed store
// URL — see config.js for why. This is the ONE place in the whole surface
// that is allowed to point at civemate.com; the share link itself (the page
// this button sits on) must never redirect there.
export function storeButtonsHtml() {
  const buttons = []
  if (STORE_ANDROID_URL) {
    buttons.push(`<a class="btn" href="${escapeHtml(STORE_ANDROID_URL)}">Get it on Google Play</a>`)
  }
  if (STORE_IOS_URL) {
    buttons.push(`<a class="btn" href="${escapeHtml(STORE_IOS_URL)}">Download on the App Store</a>`)
  }
  if (buttons.length === 0) {
    // Neither store link is configured yet (true today: no developer
    // accounts exist). A dead store link is worse than none, so this is the
    // honest default, not a placeholder to remember to remove later.
    buttons.push('<span class="btn btn-soon">App coming soon</span>')
  }
  buttons.push('<a class="btn btn-ghost" href="https://civemate.com">About CiveMate</a>')
  return buttons.join('\n      ')
}

const BASE_STYLE = `
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f2e9d8; color: #191713; }
    .wrap { max-width: 640px; margin: 0 auto; padding: 48px 24px; }
    .cover { width: 100%; aspect-ratio: 1200 / 630; object-fit: cover; border: 3px solid #191713; }
    h1 { font-size: 28px; line-height: 1.15; margin: 24px 0 8px; }
    .meta { font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: .05em; text-transform: uppercase; color: #8663b5; margin-bottom: 4px; }
    p.lede { font-size: 16px; line-height: 1.5; }
    .actions { margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 12px 20px; border: 2px solid #191713; border-radius: 999px; text-decoration: none; color: #191713; font-weight: 600; }
    .btn-soon { opacity: .55; }
    .btn-ghost { border-color: transparent; text-decoration: underline; padding-left: 4px; }
`

// The activity share page: this is the whole point of the feature. Every
// user-authored field is escaped (see html.js) before it touches this
// template, in text nodes AND in the og/twitter meta content attributes.
export function buildActivityPage({ activity, canonicalUrl }) {
  const title = activity.title || 'A CiveMate activity'
  const description = truncate(activity.description || 'See it on the live map in CiveMate.', 200)
  const image = activity.cover_url || FALLBACK_OG_IMAGE
  const cityLine = activity.city ? escapeHtml(activity.city) : ''
  const organiser = activity.organiser_display_name ? escapeHtml(activity.organiser_display_name) : ''
  const metaLine = [cityLine, organiser && `by ${organiser}`].filter(Boolean).join(' · ')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} — CiveMate</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
<meta name="robots" content="noindex, follow" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="CiveMate" />
<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(image)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />

<meta property="al:android:package" content="com.civemate.app" />
<meta property="al:android:url" content="${escapeHtml(canonicalUrl)}" />
<meta property="al:web:url" content="${escapeHtml(canonicalUrl)}" />
<style>${BASE_STYLE}</style>
</head>
<body>
  <div class="wrap">
    <img class="cover" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />
    ${metaLine ? `<div class="meta">${metaLine}</div>` : ''}
    <h1>${escapeHtml(title)}</h1>
    <p class="lede">${escapeHtml(description)}</p>
    <div class="actions">
      ${storeButtonsHtml()}
    </div>
  </div>
</body>
</html>`
}

// Privacy: a draft/cancelled/deleted/non-public activity and an id that was
// never valid get the EXACT same response — never a hint that "something is
// there, you just can't see it". No og:title naming the activity, ever.
export function buildNotFoundPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Activity not found — CiveMate</title>
<meta name="robots" content="noindex, nofollow" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="CiveMate" />
<meta property="og:title" content="Activity not found — CiveMate" />
<meta property="og:description" content="This activity is no longer available." />
<meta property="og:image" content="${escapeHtml(FALLBACK_OG_IMAGE)}" />
<style>${BASE_STYLE}</style>
</head>
<body>
  <div class="wrap">
    <h1>This activity isn't available</h1>
    <p class="lede">It may have been removed, or the link is no longer public.</p>
    <div class="actions">
      <a class="btn btn-ghost" href="https://civemate.com">About CiveMate</a>
    </div>
  </div>
</body>
</html>`
}

// Distinct from buildNotFoundPage on purpose: the backend being unreachable
// (dev VM down, timeout, 5xx) is an operational fact, not a privacy
// decision — degrade honestly instead of quietly claiming the activity
// doesn't exist.
export function buildErrorPage() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>CiveMate</title>
<meta name="robots" content="noindex, nofollow" />
<style>${BASE_STYLE}</style>
</head>
<body>
  <div class="wrap">
    <h1>Couldn't load this activity right now</h1>
    <p class="lede">Something went wrong on our end. Try the link again in a moment.</p>
    <div class="actions">
      <a class="btn btn-ghost" href="https://civemate.com">About CiveMate</a>
    </div>
  </div>
</body>
</html>`
}

export { APP_ORIGIN }
