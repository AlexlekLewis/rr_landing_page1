// Returns HTTP 410 Gone for retired pages so search engines drop them from the
// index and they can no longer be visited. Wired up via rewrites in vercel.json.
//
// Currently retiring: the 2026 Elite Program intake pages (main + legacy LP1/LP2)
// and the July 2026 open training day pages (/PGP2026/{mickleham,williamstown,hallam}
// + their success/junior/entry sub-pages). 410 (not 404) is a deliberate, stronger
// "this is permanently gone" signal to Google. Kept program-agnostic so it can serve
// any retired page.
export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');

    res.status(410).send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Page no longer available &mdash; Rajasthan Royals Academy Melbourne</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
           background:#111921; color:#fff; text-align:center; padding:24px;
           font-family:'Montserrat',system-ui,-apple-system,'Segoe UI',sans-serif; }
    .card { max-width:520px; }
    h1 { font-size:22px; font-weight:800; margin:0 0 12px; letter-spacing:-0.01em; }
    p { font-size:15px; line-height:1.6; color:rgba(255,255,255,0.72); margin:0 0 24px; }
    a { display:inline-block; padding:12px 26px; border-radius:999px; font-weight:700;
        font-size:14px; text-decoration:none; background:#E11F8F; color:#fff; }
  </style>
</head>
<body>
  <div class="card">
    <h1>This page is no longer available</h1>
    <p>This event or program has ended and the page has been retired. You can explore our current programs on the main site.</p>
    <a href="/">Go to the home page</a>
  </div>
</body>
</html>`);
}
