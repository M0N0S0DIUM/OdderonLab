// Cloudflare Worker — Decap CMS GitHub OAuth Proxy
// Deploy to: https://decap-cms-proxy.YOUR_SUBDOMAIN.workers.dev
// Then set proxy_url in admin/config.yml to this URL

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // GitHub OAuth config from environment variables
    const GITHUB_CLIENT_ID = env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = env.GITHUB_CLIENT_SECRET;

    // Route: /auth/github - redirect to GitHub OAuth
    if (url.pathname === "/auth/github") {
      const redirectUri = `${url.origin}/callback`;
      const scope = "repo";
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=decap-cms`;
      return Response.redirect(githubAuthUrl, 302);
    }

    // Route: /callback - handle GitHub callback, exchange code for token
    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code parameter", { status: 400 });
      }

      // Exchange code for access token
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        return new Response(`OAuth error: ${tokenData.error_description}`, { status: 400 });
      }

      // Return token to Decap CMS via postMessage
      const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <script>
            (function() {
              function receiveMessage(event) {
                if (event.data === 'decap-cms-auth') {
                  window.opener.postMessage({
                    payload: ${JSON.stringify(tokenData)},
                    type: 'decap-cms-auth'
                  }, '*');
                  window.close();
                }
              }
              window.addEventListener('message', receiveMessage, false);
              window.opener.postMessage('decap-cms-auth', '*');
            })();
          </script>
        </body>
        </html>
      `;

      return new Response(html, {
        headers: { "Content-Type": "text/html", ...corsHeaders },
      });
    }

    // Route: /token - refresh token (for Decap CMS init check)
    if (url.pathname === "/token") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      // Token validation would go here - for now just pass through
      return new Response(JSON.stringify({ authenticated: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Default: proxy to GitHub API for authenticated requests
    // This handles the actual API calls from Decap CMS
    if (url.pathname.startsWith("/api/")) {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader) {
        return new Response("Unauthorized", { status: 401 });
      }

      const githubUrl = `https://api.github.com${url.pathname.replace("/api", "")}${url.search}`;
      const githubResponse = await fetch(githubUrl, {
        method: request.method,
        headers: {
          "Authorization": authHeader,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Decap-CMS-Proxy",
        },
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
      });

      return new Response(githubResponse.body, {
        status: githubResponse.status,
        headers: { ...corsHeaders, ...Object.fromEntries(githubResponse.headers) },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};