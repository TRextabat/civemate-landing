// Minimal HTML-escaping helper. Activity title/description/city/organiser
// name are user-authored data straight from the API response — every one of
// them gets interpolated into both HTML text nodes and `content="..."`
// attributes below, so every one of them must go through this before it
// touches a template string. No templating engine here (single small file,
// not worth a dependency), so this is the one guard standing between a
// crafted activity title and a stored-XSS/attribute-breakout in a page
// social-media crawlers themselves will fetch and, in some cases (link
// previews with embedded scripts historically abused on older Slack/Discord
// unfurlers), execute.
export function escapeHtml(value) {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Truncate a description to a crawler-friendly length without cutting a word
// in half. og:description has no hard platform limit but every unfurler
// clips well before 300 chars anyway; keeping it short here means the same
// text remains stable when they change their own clipping behavior.
export function truncate(text, max = 200) {
  if (!text) return ''
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`
}
