// Cloudflare Worker proxy for Decap CMS GitHub OAuth
// Deploy: Cloudflare Dashboard > Workers > Create Worker > Paste this > Save & Deploy

import { DecapCMSProxyServer } from "decap-cms-proxy-server";

const proxy = new DecapCMSProxyServer();

export default {
  async fetch(request, env, ctx) {
    // CORS headers for Decap CMS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    url.pathname = url.pathname.replace("/api/cms-auth", "");

    const response = await proxy.fetch(new Request(url, request), env);

    // Add CORS headers to response
    const newHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};