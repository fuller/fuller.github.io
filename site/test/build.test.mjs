import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
test('build preserves homepage content and local stylesheet assets', () => {
  const html = read('dist/index.html');
  assert.match(html, /<title>Andrew Fuller<\/title>/);
  assert.match(html, /https:\/\/github.com\/fuller/);
  const styles = [...html.matchAll(/href="([^"]+\.css)"/g)];
  assert.ok(styles.length > 0, 'external stylesheet required for CSP');
  for (const [, href] of styles) {
    assert.ok(href.startsWith('/_astro/'));
    assert.ok(existsSync(new URL(`../dist${href}`, import.meta.url)));
  }
});
test('both pages comply with script-free and inline-style-free policy', () => {
  for (const file of ['index.html', '404.html']) {
    const html = read(`dist/${file}`);
    assert.doesNotMatch(html, /<(script|style)\b/i);
    assert.doesNotMatch(html, /\s(?:style|on\w+)\s*=/i);
    assert.match(html, /lang="en"/);
  }
});
test('Cloudflare output contains security policy and excludes private source artifacts', () => {
  const headers = read('dist/_headers');
  assert.equal(headers, read('public/_headers'));
  for (const directive of ["default-src 'none'", "script-src 'none'", "style-src 'self'", "frame-ancestors 'none'", 'X-Content-Type-Options: nosniff']) {
    assert.ok(headers.includes(directive), directive);
  }
  for (const file of ['CNAME', 'images/af.psd', 'package.json', '.env']) {
    assert.equal(existsSync(new URL(`../dist/${file}`, import.meta.url)), false, file);
  }
  assert.ok(readFileSync(new URL('../dist/favicons/favicon_comp/favicon.ico', import.meta.url)).length > 0);
});
