// =============================================
// SENTINEL-X  —  Cloudflare Worker (CORS Proxy)
// =============================================
//
// DEPLOY STEPS:
//   1. Go to https://dash.cloudflare.com → Workers & Pages
//   2. Click "Create Worker" → give it a name (e.g. sentinel-proxy)
//   3. Paste this ENTIRE file as the worker code
//   4. Click "Deploy"
//   5. Copy the worker URL (e.g. https://sentinel-proxy.your-name.workers.dev)
//   6. Open app.js and set CONFIG.baseURL to:
//        https://sentinel-proxy.your-name.workers.dev/v1/chat/completions
//   7. Upload index.html, style.css, app.js to GitHub Pages
//
// =============================================

const TARGET_API = 'https://gpt.crax.lol';

// CORS headers added to every response
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent, Accept',
  'Access-Control-Expose-Headers': 'Retry-After, X-RateLimit-Remaining',
};

// Handle preflight OPTIONS requests
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

// Proxy the actual request to the target API
async function handleRequest(request, path) {
  try {
    // Build the target URL
    const targetURL = TARGET_API + path;

    // Clone headers from the original request
    const headers = new Headers(request.headers);
    // Remove origin-related headers that cause CORS issues on the target
    headers.delete('origin');
    headers.delete('referer');

    // Forward the request to the target API
    const targetRequest = new Request(targetURL, {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : request.body,
    });

    const response = await fetch(targetRequest);

    // Build a new response with CORS headers
    const newHeaders = new Headers(response.headers);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    // For streaming responses, pass through the body as a stream
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });

  } catch (err) {
    return new Response(
      JSON.stringify({
        error: {
          message: 'Proxy error: ' + err.message,
          type: 'proxy_error',
        }
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    );
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Health check endpoint
    if (path === '/' || path === '/health') {
      return new Response(
        JSON.stringify({
          status: 'SENTINEL-X proxy active',
          target: TARGET_API,
          time: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...CORS_HEADERS,
          },
        }
      );
    }

    // Proxy all other requests
    return handleRequest(request, path);
  },
};