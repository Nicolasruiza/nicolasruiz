# Portfolio country experiences

## Current deployment and activation status

Repository: `Nicolasruiza/nicolasruiz` (not `sofia-agudelo`).
Public URL: **https://nicolasruiz.net**.

Inspection on 2026-10-16 found GitHub Pages serving the domain directly
(`Server: GitHub.com`, GitHub Pages A records, GoDaddy nameservers). The repo
has a `CNAME`, `.nojekyll`, and a workflow generating the resume PDF.

On 2026-10-16, the domain was moved to Cloudflare nameservers and the
`nicolasruiz-portfolio` Worker was deployed with Static Assets. Cloudflare
Custom Domains now point both `nicolasruiz.net` and `www.nicolasruiz.net` to
the Worker. The previous GitHub Pages A records and `www` CNAME were removed;
the `_dmarc` TXT record was retained. Production version at cutover:
`e95baf1b-d340-44de-8e27-20774abe5872`.

Live verification from Toronto confirmed that the Canadian Home and Contact
responses contain no relocation, 2027, Colombian residence, market slots or
Colombia positioning. Both hostnames returned the Worker response with
`private, no-store`, `CDN-Cache-Control: no-store` and
`Cloudflare-CDN-Cache-Control: no-store`. The public authoritative nameservers
and public resolvers returned the Worker custom-domain address. The deterministic
runtime suite covers Colombia and unknown-country behavior because client
headers intentionally cannot override Cloudflare's production country metadata.

## Behavior

- Only `request.cf.country === CA` selects Canada (case/whitespace normalized).
- Any other code, an empty value, or missing country metadata selects Colombia.
- The country comes from Cloudflare's IP metadata. Browser headers, language,
  cookies and query parameters cannot override it.
- Every request runs the Worker first. HTML slots are resolved at the server,
  before any browser render. No geolocation fetch, browser switching, hidden
  Colombia blocks, or client bundle containing the relocation text is needed.
- The complete relocation paragraph and regional contact section live in
  `server/market-blocks.mjs`. Shared professional history, achievements, projects,
  images, navigation and resume download are retained.
- HTML is `private, no-store` at browser and CDN layers. Conditional validators
  and HTML ranges cannot return a cached/partial response for a different market.
- `/`, `/index.html`, `/contact.html`, query strings and existing links retain
  their public URLs; no country URL or visible country selector is introduced.
- Home and Contact use neutral descriptions and stable canonical URLs.
  Colombia positioning blocks use `data-nosnippet` so supporting search engines
  can exclude those blocks from search snippets. This is not access control or
  a guarantee about existing search caches. Crawlers follow the same IP rule.

## Local verification

Use Node 24 and the pnpm version in `package.json`:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm exec playwright install chromium
pnpm test:browser
pnpm build
pnpm exec wrangler deploy --dry-run
```

`CHROME_PATH` may point to an existing Chrome executable for browser tests.
The tests use the real local Cloudflare runtime and asset binding, with injected
connection metadata, not a production country-override header. They cover Canada,
Colombia, third countries, unknown/missing country, source HTML, cache isolation,
aliases/encoded URLs, HEAD, downloads, private source exclusion and unchanged
shared pages. Browser checks cover 1440, 768 and 390 px, both with and without
JavaScript, print content and screenshots without decorative gradients.

The PR workflow repeats tests and a deployment dry run, and saves screenshots.
`pnpm dev` serves the Worker locally; tests are the deterministic way to select
each country. Do not test by adding `CF-IPCountry` to a browser request.

## Reproduce or move the deployment

1. Create a Cloudflare account and add `nicolasruiz.net`. Review/import the
   existing DNS zone, preserving unrelated records such as mail records. Update
   the nameservers at the current registrar as instructed by Cloudflare. The
   domain can remain registered with the current registrar.
2. In the checked-out feature branch, run the verification commands above,
   `pnpm exec wrangler login`, then `pnpm deploy`. This uploads the Worker and
   public assets. `workers.dev` and preview URLs are disabled in the config, so
   uploading alone does not switch the live site or expose a second public site.
3. When the zone is active, open Workers & Pages → `nicolasruiz-portfolio` →
   Settings → Domains & Routes → Add → Custom Domain, and connect
   `nicolasruiz.net`. Resolve the existing GitHub Pages web DNS record conflict
   at this cutover step. Use a Worker **Custom Domain**, not a fail-open proxy
   route that could fall back to unfiltered origin HTML. If `www` is in use,
   connect it to the same Worker or preserve a redirect to the apex domain.
4. Verify the live domain from a Canadian connection and a non-Canadian
   connection: Home and Contact, view-source, navigation, resume PDF, mobile,
   and HTML cache headers. Canadian responses must not contain the relocation
   paragraph or Colombian residence; non-Canadian responses must contain both
   where appropriate. Unknown country is covered deterministically by tests.
5. After successful cutover, merge the PR and use `pnpm deploy` for subsequent
   releases. GitHub Pages publishing alone no longer updates the Worker assets.
   The existing resume workflow still generates the PDF; deploy again after its
   refreshed PDF commit so the Worker serves that revision. Cloudflare's Git
   integration can automate deployment using `pnpm install --frozen-lockfile &&
   pnpm build` and `pnpm exec wrangler deploy` if desired.

Rollback: redeploy a known-good Worker version first. Reverting DNS to the old
GitHub Pages deployment disables geolocation and may restore the old public
relocation text; it is not an equivalent implementation of these requirements.

## References

- [GitHub Pages is static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Run the Worker before serving assets](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/)
- [Cloudflare request country metadata](https://developers.cloudflare.com/workers/runtime-apis/request/)
- [Worker Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
- [Google snippet controls](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
