# Astro site for Cloudflare Pages

The current homepage is in `src/pages/index.astro`; static assets are in `public/`.
The existing root HTML and CNAME remain in place for GitHub Pages until cutover.

## Local development

Use Node 24. From this directory:

```sh
npm ci
npm run dev
npm run build
npm run preview
```

In Codex Cloud, use `npm ci --cache /workspace/.npm-cache` if the default npm cache is not writable.

## Connect Cloudflare Pages to GitHub

In Cloudflare, create a **Pages** project with Git integration (not a direct-upload project). Authorize Cloudflare's GitHub app for `fuller/fuller.github.io`.

Use these settings:

| Setting | Value |
| --- | --- |
| Root directory | `site` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=24` |

Choose a production branch containing this directory. For the long-term workflow, merge this change into `master` and select `master`; use a feature branch for review before cutover. No Cloudflare adapter or API token is required for this static Astro build. Cloudflare handles Git authorization through its GitHub app.

First verify the generated pages.dev deployment: homepage content, favicon, mobile layout, and outbound links. Then add custom domains in the Pages project's Custom domains settings and follow Cloudflare's DNS instructions. Add domains through Pages before changing DNS. Verify HTTPS and both hostnames after propagation. Keep the current hosting available until cutover is verified.

The user reports `andrewfuller.dev` and `andrewfuller.xyz` serve the current site. The root CNAME names `.xyz`; the live DNS and redirect configuration have not been verified. Decide which is canonical before setting a redirect from the other domain. Avoid conflicting Pages, DNS, or redirect rules. This project intentionally does not publish a GitHub CNAME artifact.

After both domains work on Pages, disable the old GitHub Pages deployment. The obsolete Grunt dependencies have been removed. Legacy root HTML and assets remain until cutover.

## Security

The static site sends no client JavaScript and needs no runtime secrets. `public/_headers` configures Cloudflare Pages response headers, including a restrictive CSP. Astro emits CSS as external files so styles work without unsafe-inline. If adding scripts, analytics, forms, fonts, or external assets, update the policy deliberately and verify it in a browser. Local Astro preview does not apply Cloudflare's `_headers`; verify headers on the deployed pages.dev URL and custom domains. These headers apply to static Pages responses; future Functions need their own response headers.

A generated 404.html avoids Pages' default SPA fallback for missing URLs. Photoshop source files are excluded from the new public output; the original remains in the legacy checkout. Never place secrets or private source assets under public/.

Development and preview bind to loopback by default. Use `npm run dev -- --host 0.0.0.0` only when shared environment access is needed.

Before cutover, verify:

- Cloudflare and GitHub accounts use MFA/passkeys; grant the GitHub app access only to this repository.
- Protect master with reviewed pull requests; set Cloudflare production deployments to master after merging. Do not leave a temporary feature branch as production.
- Keep deployment credentials out of the repository and build variables unless required. This static build requires none.
- Enable HTTPS redirects for both custom domains. Verify certificates, canonical redirects, and absence of redirect loops before considering HSTS. Do not enable includeSubDomains/preload without checking every subdomain.
- Preview deployments are public unless Cloudflare Access protection is configured. Do not publish private content in previews.
- On deployed responses, verify CSP, nosniff, frame restrictions, expected page styling, and an HTTP 404 for an unknown path. Disable conflicting Cloudflare script injection/optimizations if they violate the no-script policy.
- Review Dependabot PRs and run npm audit periodically. The root package.json now only delegates commands to the Astro site; it has no dependencies. Cloudflare builds must stay rooted in site/.

## Validation

After building, run `npm test` to check the generated pages, stylesheet assets, and Cloudflare security policy. GitHub Actions runs dependency auditing, build, and these tests on pull requests and production/migration branch pushes. Require the build job in branch protection after it passes on GitHub.
