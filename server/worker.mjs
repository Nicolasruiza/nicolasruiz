import { colombiaBlocks, marketForCountry } from './market-blocks.mjs';

export function fitsUpstreamUrl(value) {
  const incoming = value instanceof URL ? value : new URL(value);
  const suffix = incoming.pathname.slice('/fits'.length) || '/';
  const upstream = new URL(`https://nicolasruiza.github.io/Fits${suffix}`);
  upstream.search = incoming.search;
  return upstream;
}

async function serveFits(request, url) {
  const upstream = await fetch(fitsUpstreamUrl(url), {
    method: request.method,
    headers: {
      Accept: request.headers.get('accept') || '*/*',
      'Accept-Language': request.headers.get('accept-language') || 'en',
    },
    redirect: 'follow',
  });
  const response = new Response(request.method === 'HEAD' ? null : upstream.body, upstream);
  for (const name of ['content-length', 'content-encoding']) response.headers.delete(name);
  if (!response.headers.get('content-type')?.includes('text/html') || request.method === 'HEAD') return response;
  response.headers.set('Cache-Control', 'private, no-store');
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
  return new HTMLRewriter().on('head', {
    element(element) {
      element.prepend('<base href="/fits/"><link rel="canonical" href="https://nicolasruiz.net/fits">', { html: true });
    },
  }).transform(response);
}

export default {
  async fetch(request, env) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    // Only Cloudflare's connection metadata is trusted, never a client header,
    // query parameter, cookie, browser locale or a third-party geolocation API.
    const market = marketForCountry(request.cf?.country);
    const url = new URL(request.url);
    if (url.pathname === '/fits' || url.pathname.startsWith('/fits/')) return serveFits(request, url);
    // Clean URL for AI Projects; the old file URL and a trailing slash redirect to it.
    if (url.pathname === '/AI%20Projects.dc.html' || url.pathname === '/AI Projects.dc.html' || url.pathname === '/ai-projects/') {
      return Response.redirect(new URL(`/ai-projects${url.search}`, url), 301);
    }
    if (url.pathname === '/ai-projects') url.pathname = '/AI%20Projects.dc.html';
    // Preserve the existing public .html URLs and also support extensionless aliases.
    if (url.pathname === '/' || url.pathname === '/index') url.pathname = '/index.html';
    if (url.pathname === '/contact') url.pathname = '/contact.html';
    // The Helix prototype linked from AI Projects ("View prototype").
    if (url.pathname === '/helix' || url.pathname === '/helix/') url.pathname = '/helix/index.html';
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
