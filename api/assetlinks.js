// GET /.well-known/assetlinks.json on app.civemate.com (vercel.json rewrite).
// Digital Asset Links statement so Android verifies app.civemate.com App
// Links for com.civemate.app instead of always opening in the browser.
//
// IMPORTANT — only the DEBUG keystore fingerprint is listed below. The
// mobile repo (civemate-mobile) has no release keystore yet (only
// android/app/debug.keystore exists). Before shipping a release build, the
// RELEASE signing certificate's SHA-256 fingerprint MUST be added to this
// array (`keytool -list -v -keystore <release.keystore> | grep SHA256`) or
// Android will silently fail App Link verification for anyone running a
// release build — it fails quietly, not with an error a user or crawler
// would ever see.
import { ANDROID_PACKAGE_NAME } from './_lib/config.js'

// SHA-256 of android/app/debug.keystore's `androiddebugkey` alias, as of
// this commit (`keytool -list -v -keystore debug.keystore -storepass
// android -alias androiddebugkey`). Debug-signed builds only.
const DEBUG_SHA256_FINGERPRINT =
  'FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C'

const STATEMENTS = [
  {
    relation: ['delegate_permission/common.handle_all_urls'],
    target: {
      namespace: 'android_app',
      package_name: ANDROID_PACKAGE_NAME,
      sha256_cert_fingerprints: [DEBUG_SHA256_FINGERPRINT],
    },
  },
]

export default function handler(req, res) {
  res.status(200)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.send(JSON.stringify(STATEMENTS, null, 2))
}
