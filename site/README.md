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

After both domains work on Pages, disable the old GitHub Pages deployment. Legacy Grunt files and unused assets can be removed in a subsequent cleanup once the migration is verified.
