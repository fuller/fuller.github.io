# Astro on Cloudflare Workers with Static Assets

Use Node 24. The Astro homepage is in src/pages/index.astro; static assets are in public/. The legacy root site and CNAME remain available for GitHub Pages until the domain cutover is verified.

## Development and validation

From site/:

```sh
npm ci
npm run dev
npm run build
npm test
npm run deploy:check
npm run workers:dev
```

Astro dev provides hot reload. workers:dev serves the built dist/ using Cloudflare's local runtime on port 8787, including static asset headers and routing. Rebuild after changes. npm run preview uses Astro's server and does not apply _headers. All local servers bind to loopback by default. In Codex use npm ci --cache /workspace/.npm-cache if the home cache is not writable.

## Connect GitHub using Workers Builds

Create a Worker with Git integration for fuller/fuller.github.io. Grant the Cloudflare GitHub app access only to this repository.

| Setting | Value |
| --- | --- |
| Project/Worker name | andrew-fuller |
| Branch for initial testing | setup/cloudflare-pages |
| Root directory | site |
| Build command | npm run build |
| Deploy command | npm run deploy |
| Preview/non-production command | npm run deploy:preview |
| Environment variable | NODE_VERSION=24 |

The branch keeps its existing name for continuity. Merge into master and select master as the production branch for the ongoing workflow. The Worker name in the dashboard must match wrangler.json. Preview uploads create versions; they do not replace production. Preview URLs are public unless protected with Cloudflare Access. Cloudflare supplies deployment authentication to its builds; do not commit tokens or add credentials to public assets.

wrangler.json deploys only dist/ with explicit HTML routing and a real 404 page. There is no Worker script, runtime secret, or Astro SSR adapter required. To add API endpoints later, add a Worker entry point and scoped routing/bindings; update tests and apply headers to dynamic responses separately. To add Astro server-rendered routes, evaluate the Astro Cloudflare adapter at that time.

First verify the workers.dev URL: homepage, styles, favicon, response security headers, and HTTP 404 for a missing path. Then add Custom Domains through the Worker dashboard. The user identifies andrewfuller.dev and andrewfuller.xyz; the legacy root CNAME names .xyz. Live DNS, redirect behavior, and certificates remain unverified. Decide which domain is canonical before redirecting the other. Verify both domains and HTTPS before disabling GitHub Pages. No domain routes are declared in the repository, so a code deploy alone will not switch live domains.

## Security

public/_headers supplies a restrictive CSP, nosniff, frame restrictions, referrer policy, and permissions policy for static responses. Astro emits external CSS to avoid unsafe-inline. No JavaScript runs in the current site. When adding scripts, forms, analytics, external fonts, or dynamic responses, update the policy deliberately and verify browser behavior. Avoid Cloudflare script injection/optimizations that conflict with the policy.

Never place secrets or private source files under public/. The Photoshop file is excluded from the new output; legacy copies remain until cutover. GitHub Actions audits dependencies, builds, and tests on pull requests and relevant branch pushes. Dependabot checks npm dependencies weekly. Review these PRs before merging.

Use MFA/passkeys for Cloudflare and GitHub. Protect master with reviewed pull requests and require CI after verifying it on GitHub. Preview deployments must not contain private content. Verify HTTPS redirects before considering HSTS; do not enable includeSubDomains/preload without checking all subdomains.

The build uses a pinned Wrangler dev dependency and a committed lockfile. Run npm audit periodically. CI does not deploy or receive Cloudflare secrets.
