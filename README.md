# Andrew Fuller

Astro source and Cloudflare Pages deployment instructions are in [site/README.md](site/README.md).

Use Node 24. Install with `cd site && npm ci`, then run `npm run dev`, `npm run build`, and `npm test` there. Root npm scripts delegate to site/; the root has no dependencies. The obsolete Grunt pipeline has been removed.

The root index.html, CNAME, and old assets remain for the existing GitHub Pages deployment until Cloudflare custom domains have been verified. Do not delete them or disable GitHub Pages before that cutover. Cloudflare must build from site/ and publish dist/.
