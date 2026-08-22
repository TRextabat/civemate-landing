// Shared config for the app.civemate.com serverless surface (api/a/[id].js,
// api/app-home.js, api/assetlinks.js). One place to read env vars so every
// function degrades the same way when a value is unset, instead of three
// slightly different fallback rules.

// Backend base URL. The dev VM is currently down (api.civemate.com -> 522) —
// that is a *runtime* fact, not a reason to hardcode a different value here;
// these functions must degrade honestly (see buildErrorPage) rather than
// pretend the API is reachable.
export const API_BASE_URL = process.env.API_BASE_URL || 'https://api.civemate.com'

// This deployment's own origin — used to build absolute og:url/og:image
// values and the fallback cover image. Vercel does not need this to route
// (the platform already knows its own host), it is only for the *values* we
// print into the HTML.
export const APP_ORIGIN = process.env.APP_ORIGIN || 'https://app.civemate.com'

// Store links are CONFIGURABLE and intentionally allowed to be unset — the
// app is not published to either store yet. A function must never print a
// store URL that 404s; see storeButtonsHtml() in render.js, which renders a
// "coming soon" state instead of a dead link when a var is empty.
export const STORE_ANDROID_URL = process.env.STORE_ANDROID_URL || ''
export const STORE_IOS_URL = process.env.STORE_IOS_URL || ''

// Deliberate fallback when an activity has no cover (never a broken image
// tag): the same static /og-image.png this project already builds for the
// marketing site's own share preview (scripts/generate-og.mjs), just served
// from this origin instead. Override via env if a dedicated "generic
// activity" card is ever designed.
export const FALLBACK_OG_IMAGE = process.env.OG_FALLBACK_IMAGE_URL || `${APP_ORIGIN}/og-image.png`

// Android package this deployment's assetlinks.json declares ownership for.
export const ANDROID_PACKAGE_NAME = 'com.civemate.app'
