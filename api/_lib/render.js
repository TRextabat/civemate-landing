// Shared HTML rendering for the app.civemate.com serverless surface. Kept
// separate from html.js (low-level escaping/truncation) and config.js (env
// reads) so api/a/[id].js and api/app-home.js stay thin request handlers.
import { escapeHtml, truncate } from './html.js'
import {
  ANDROID_PACKAGE_NAME,
  APP_ORIGIN,
  FALLBACK_OG_IMAGE,
  MARKETING_ORIGIN,
  STORE_ANDROID_URL,
  STORE_IOS_URL,
} from './config.js'

// Every activity in production today carries `timezone: "Europe/Istanbul"`
// (Turkey is the only launch market — see config.js/CLAUDE.md). Only used
// when an activity record is somehow missing the field; never overrides a
// real value.
const DEFAULT_ACTIVITY_TIMEZONE = 'Europe/Istanbul'

// "Sat, Jan 10 · 21:00" / "Cmt, Oca 10 · 21:00" — same shape (weekday,
// month day · HH:mm) the mobile app's `formatActivityDate`/`formatDateRange`
// use (src/utils/format.ts), rendered in the ACTIVITY's own timezone (not
// the visitor's or the server's — this is a static page anyone in any
// timezone can load) so "21:00" always means 21:00 in the city the activity
// is actually happening in. Built from `Intl.DateTimeFormat` (Node builtin)
// rather than pulling in `date-fns` as a new dependency just for this one
// string; token text is ICU's, so a short weekday can render one letter off
// mobile's date-fns-locale spelling (e.g. "Cmt" here vs mobile's "Cts") —
// same information, not byte-identical, which is an acceptable trade-off
// for not adding a dependency to this small serverless surface.
export function formatActivityDateTime(startTimeIso, timezone, lang) {
  if (!startTimeIso) return ''
  const date = new Date(startTimeIso)
  if (Number.isNaN(date.getTime())) return ''
  const tz = timezone || DEFAULT_ACTIVITY_TIMEZONE
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US'
  let parts
  try {
    parts = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: tz,
    }).formatToParts(date)
  } catch {
    // Unknown/invalid IANA timezone string on the activity record: degrade
    // to the default market timezone rather than throwing and 502ing an
    // otherwise-valid share page over a cosmetic field.
    parts = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: DEFAULT_ACTIVITY_TIMEZONE,
    }).formatToParts(date)
  }
  const get = (type) => parts.find((p) => p.type === type)?.value || ''
  return `${get('weekday')}, ${get('month')} ${get('day')} · ${get('hour')}:${get('minute')}`
}

// Requester's language, from `Accept-Language` — the only signal this
// static, no-session serverless surface has. Defaults to English (the
// standard web default absent a signal); a Turkish-tagged header (the
// primary launch market) switches the date string to Turkish tokens. Only
// gates the date format, not the page's copy (still English throughout,
// title/buttons/404 text) — full bilingual copy for this share surface is a
// separate, larger change than this fix.
export function resolveLang(acceptLanguageHeader) {
  return String(acceptLanguageHeader || '').toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

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
  buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(MARKETING_ORIGIN)}">About CiveMate</a>`)
  return buttons.join('\n      ')
}

const BASE_STYLE = `
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f2e9d8; color: #191713; }
    .wrap { max-width: 640px; margin: 0 auto; padding: 48px 24px; }
    .cover { width: 100%; aspect-ratio: 1200 / 630; object-fit: cover; border: 3px solid #191713; }
    h1 { font-size: 28px; line-height: 1.15; margin: 24px 0 8px; }
    .meta { font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: .05em; text-transform: uppercase; color: #8663b5; margin-bottom: 4px; }
    p.when { font-weight: 600; font-size: 15px; margin: 0 0 8px; }
    p.lede { font-size: 16px; line-height: 1.5; }
    .actions { margin-top: 28px; display: flex; gap: 12px; flex-wrap: wrap; }
    .btn { display: inline-block; padding: 12px 20px; border: 2px solid #191713; border-radius: 999px; text-decoration: none; color: #191713; font-weight: 600; }
    .btn-soon { opacity: .55; }
    .btn-ghost { border-color: transparent; text-decoration: underline; padding-left: 4px; }
`

// The activity share page: this is the whole point of the feature. Every
// user-authored field is escaped (see html.js) before it touches this
// template, in text nodes AND in the og/twitter meta content attributes.
export function buildActivityPage({ activity, canonicalUrl, lang = 'en' }) {
  const title = activity.title || 'A CiveMate activity'
  const description = truncate(activity.description || 'See it on the live map in CiveMate.', 200)
  const image = activity.cover_url || FALLBACK_OG_IMAGE
  // The real cover image comes back at whatever aspect ratio the creator
  // uploaded (media pipeline's STANDARD/HIGH_RES variants bound only the
  // LONGEST side — modules/media/workers/tasks.py's `img.thumbnail((max_dim,
  // max_dim), ...)` — so a portrait or square cover is never re-cropped to
  // 1200x630 anywhere in the pipeline). Asserting a fixed 1200x630 here for
  // an image we haven't measured makes unfurlers letterbox or drop it. Only
  // the FALLBACK_OG_IMAGE is a real, known, fixed-size asset (public/og-
  // image.png, checked to be exactly 1200x630) — declare dimensions for
  // that one only; omit the tags entirely for a real (unmeasured) cover.
  const usingFallbackImage = !activity.cover_url
  const cityLine = activity.city ? escapeHtml(activity.city) : ''
  const organiser = activity.organiser_display_name ? escapeHtml(activity.organiser_display_name) : ''
  const metaLine = [cityLine, organiser && `by ${organiser}`].filter(Boolean).join(' · ')
  const dateLabel = formatActivityDateTime(activity.start_time, activity.timezone, lang)
  // WHEN the event is is the second most important fact after the title
  // (right after "what") — folded into og:description so the WhatsApp/
  // Telegram/etc. unfurl card carries it without opening the page.
  const descriptionWithDate = dateLabel ? `${dateLabel} — ${description}` : description

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)} — CiveMate</title>
<meta name="description" content="${escapeHtml(descriptionWithDate)}" />
<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
<meta name="robots" content="noindex, follow" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="CiveMate" />
<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
<meta property="og:title" content="${escapeHtml(title)}" />
<meta property="og:description" content="${escapeHtml(descriptionWithDate)}" />
<meta property="og:image" content="${escapeHtml(image)}" />${usingFallbackImage ? `
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />` : ''}

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(title)}" />
<meta name="twitter:description" content="${escapeHtml(descriptionWithDate)}" />
<meta name="twitter:image" content="${escapeHtml(image)}" />

<meta property="al:android:package" content="${escapeHtml(ANDROID_PACKAGE_NAME)}" />
<meta property="al:android:url" content="${escapeHtml(canonicalUrl)}" />
<meta property="al:web:url" content="${escapeHtml(canonicalUrl)}" />
<style>${BASE_STYLE}</style>
</head>
<body>
  <div class="wrap">
    <img class="cover" src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />
    ${metaLine ? `<div class="meta">${metaLine}</div>` : ''}
    <h1>${escapeHtml(title)}</h1>
    ${dateLabel ? `<p class="when">${escapeHtml(dateLabel)}</p>` : ''}
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
      <a class="btn btn-ghost" href="${escapeHtml(MARKETING_ORIGIN)}">About CiveMate</a>
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
      <a class="btn btn-ghost" href="${escapeHtml(MARKETING_ORIGIN)}">About CiveMate</a>
    </div>
  </div>
</body>
</html>`
}

export { APP_ORIGIN }
