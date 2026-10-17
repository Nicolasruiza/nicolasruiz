import { colombiaBlocks, marketForCountry } from './market-blocks.mjs';

export default {
  async fetch(request, env) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    // Only Cloudflare's connection metadata is trusted, never a client header,
    // query parameter, cookie, browser locale or a third-party geolocation API.
    const market = marketForCountry(request.cf?.country);
    const url = new URL(request.url);
    // Preserve the existing public .html URLs and also support extensionless aliases.
    if (url.pathname === '/' || url.pathname === '/index') url.pathname = '/index.html';
    if (url.pathname === '/contact') url.pathname = '/contact.html';
    const headers = new Headers(request.headers);
    // A 304 could reuse another country's HTML in a browser/proxy cache.
    headers.delete('if-none-match');
    headers.delete('if-modified-since');
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { return new Response('Bad request', { status: 400 }); }
    if (/\.html$/i.test(pathname) || !/\.[^/]+$/.test(pathname)) {
      headers.delete('range');
      headers.delete('if-range');
    }
    const asset = await env.ASSETS.fetch(new Request(url, { method: 'GET', headers }));
    if (!asset.headers.get('content-type')?.includes('text/html')) {
      return request.method === 'HEAD' ? new Response(null, asset) : asset;
    }

    const response = new Response(asset.body, asset);
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('CDN-Cache-Control', 'no-store');
    response.headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
    for (const name of ['etag', 'last-modified', 'content-length', 'content-encoding', 'accept-ranges', 'content-range']) {
      response.headers.delete(name);
    }
    // Slots contain neutral Canadian fallbacks. Colombia blocks never ship as
    // hidden DOM, templates, JSON or client JavaScript in a Canadian response.
    const rendered = new HTMLRewriter().on('[data-market-slot]', {
      element(element) {
        const slot = element.getAttribute('data-market-slot');
        if (!(slot in colombiaBlocks)) throw new Error(`Unknown market slot: ${slot}`);
        if (market === 'colombia') element.replace(colombiaBlocks[slot], { html: true });
        else element.removeAndKeepContent();
      },
    }).transform(response);
    if (request.method === 'HEAD') {
      await rendered.body.cancel();
      return new Response(null, rendered);
    }
    return rendered;
  },
};
