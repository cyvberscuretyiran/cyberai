// =============================================
// SENTINEL-X  —  Cloudflare Worker (CORS Proxy)
// =============================================
//
// DEPLOY STEPS:
//   1. Go to https://dash.cloudflare.com → Workers & Pages
//   2. Click "Create Worker" → name it (e.g. sentinel-proxy)
//   3. Paste this ENTIRE file as the worker code → Deploy
//   4. Go to Worker Settings > Variables & Secrets:
//      - AI_API_KEY  = your-api-key  (click "Encrypt")
//      - TARGET_API  = https://gpt.crax.lol  (plain text)
//   5. Copy your worker URL, e.g.:
//      https://sentinel-proxy.your-name.workers.dev
//   6. In app.js, set CONFIG.baseURL to:
//      https://sentinel-proxy.your-name.workers.dev/v1/chat/completions
//   7. Upload ONLY index.html + style.css + app.js to GitHub Pages
//      NEVER upload worker.js to a public repo!
//
// SECURITY MODEL:
//   - The API key lives ONLY inside Cloudflare's encrypted
//     environment variables — it never reaches the browser.
//   - The client sends the payload with zero credentials.
//   - The worker injects the key server-side before forwarding.
//   - Streaming (SSE) is fully supported via body passthrough.
//
// =============================================

// CORS headers for all responses back to the browser
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Access-Control-Expose-Headers': 'Retry-After, X-RateLimit-Remaining',
};

// Append CORS headers to any response
function withCORS(response, extraHeaders = {}) {
  const h = new Headers(response.headers);
  for (const [k, v] of Object.entries({ ...CORS_HEADERS, ...extraHeaders })) {
    h.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: h,
  });
}

// JSON error response
function jsonError(message, status = 500) {
  return new Response(
    JSON.stringify({ error: { message, type: 'proxy_error' } }),
    {
      status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    }
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    // --- CORS preflight ---
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // --- Health check ---
    if (path === '/' || path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'SENTINEL-X proxy active',
          target: env.TARGET_API || '(not configured)',
          has_key: !!env.AI_API_KEY,
          time: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        }
      );
    }

    // --- Only POST is allowed ---
    if (request.method !== 'POST') {
      return jsonError('Method Not Allowed. Use POST.', 405);
    }

    // --- Validate env vars ---
    const targetAPI = env.TARGET_API;
    const apiKey = env.AI_API_KEY;

    if (!targetAPI || !apiKey) {
      return jsonError(
        'Worker not configured. Set TARGET_API and AI_API_KEY in Worker Settings > Variables & Secrets.',
        503
      );
    }

    // --- Build upstream request ---
    try {
      const targetURL = targetAPI + path;

      // Read the client body once (needed to set new headers)
      const clientBody = await request.text();

      const upstreamHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'User-Agent': 'sentinel-x-terminal/3.8',
      };

      // If the client requested streaming, tell the upstream too
      const acceptHeader = request.headers.get('Accept') || '';
      if (acceptHeader.includes('text/event-stream')) {
        upstreamHeaders['Accept'] = 'text/event-stream';
      }

      const upstreamResponse = await fetch(targetURL, {
        method: 'POST',
        headers: upstreamHeaders,
        body: clientBody,
      });

      // Stream the response back to the client with CORS headers
      return withCORS(upstreamResponse);

    } catch (err) {
      return jsonError('Proxy upstream error: ' + err.message, 502);
    }
  },
};
