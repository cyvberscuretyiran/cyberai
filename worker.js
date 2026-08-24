// =============================================
// SENTINEL-X  —  Cloudflare Worker (CORS Proxy)
// =============================================
//
// ARCHITECTURE:
//   GitHub Pages (browser) → Cloudflare Worker → AI API
//
//   The browser NEVER sees the API key.
//   The worker reads it from encrypted env vars (env.AI_API_KEY)
//   and injects it server-side before forwarding to the upstream API.
//
// DEPLOY (Dashboard):
//   1. https://dash.cloudflare.com → Workers & Pages → Create Worker
//   2. Name it: sentinel-proxy
//   3. Paste this file → Deploy
//   4. Settings > Variables & Secrets:
//        AI_API_KEY   = your-real-api-key   (click Encrypt)
//        TARGET_API    = https://gpt.crax.lol  (plain text)
//        ALLOWED_ORIGIN = https://yourusername.github.io  (optional, plain text)
//
// DEPLOY (CLI — recommended):
//   npm install -g wrangler
//   wrangler login
//   echo "your-real-api-key" | wrangler secret put AI_API_KEY
//   wrangler secret put TARGET_API    # type: https://gpt.crax.lol
//   wrangler secret put ALLOWED_ORIGIN # type your GitHub Pages URL (or * for any)
//   wrangler deploy
//
// TEST:
//   curl https://sentinel-proxy.your-subdomain.workers.dev/health
//   curl -X POST https://sentinel-proxy.your-subdomain.workers.dev/v1/chat/completions \
//     -H "Content-Type: application/json" \
//     -d '{"model":"test","messages":[{"role":"user","content":"hi"}]}'
//
// =============================================

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;
    const origin = request.headers.get('Origin') || '';

    // --- Determine allowed origin for CORS ---
    // If ALLOWED_ORIGIN is set to *, allow all (development)
    // If set to a specific URL, only that origin gets CORS headers
    // If not set, default to * for backwards compatibility
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const corsOrigin = (allowedOrigin === '*' || allowedOrigin === origin)
      ? (allowedOrigin === '*' ? '*' : origin)
      : allowedOrigin; // fallback

    const CORS_HEADERS = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Expose-Headers': 'Retry-After, X-RateLimit-Remaining',
      'Access-Control-Max-Age': '86400', // cache preflight for 24h
    };

    // Helper: wrap a response with CORS headers
    function withCORS(response, extra = {}) {
      const h = new Headers(response.headers);
      for (const [k, v] of Object.entries({ ...CORS_HEADERS, ...extra })) {
        h.set(k, v);
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: h,
      });
    }

    // Helper: JSON error response
    function jsonError(message, status = 500) {
      return new Response(
        JSON.stringify({ error: { message, type: 'proxy_error' } }),
        { status, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ====== 1. CORS PREFLIGHT ======
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // ====== 2. HEALTH CHECK ======
    if (path === '/' || path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'SENTINEL-X proxy active',
          target: env.TARGET_API || '(not configured)',
          origin_policy: allowedOrigin,
          has_key: !!env.AI_API_KEY,
          time: new Date().toISOString(),
        }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } }
      );
    }

    // ====== 3. METHOD CHECK ======
    if (request.method !== 'POST') {
      return jsonError('Method Not Allowed. Use POST.', 405);
    }

    // ====== 4. VALIDATE SECRETS ======
    const targetAPI = env.TARGET_API;
    const apiKey = env.AI_API_KEY;

    if (!targetAPI || !apiKey) {
      return jsonError(
        'Worker misconfigured. Set TARGET_API and AI_API_KEY in Worker environment variables.',
        503
      );
    }

    // ====== 5. PROXY REQUEST TO UPSTREAM ======
    try {
      const targetURL = targetAPI + path;

      // Read the client body (we need to re-send it with new headers)
      const clientBody = await request.text();

      // Build upstream headers — inject the API key from env
      const upstreamHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'User-Agent': 'sentinel-x-terminal/3.8',
      };

      // Forward streaming hint if the client requested it
      if ((request.headers.get('Accept') || '').includes('text/event-stream')) {
        upstreamHeaders['Accept'] = 'text/event-stream';
      }

      // Forward to the real API (server-to-server, no CORS issues)
      const upstream = await fetch(targetURL, {
        method: 'POST',
        headers: upstreamHeaders,
        body: clientBody,
      });

      // Pass the response (including streaming body) back to the browser with CORS
      return withCORS(upstream);

    } catch (err) {
      return jsonError('Upstream connection failed: ' + err.message, 502);
    }
  },
};
