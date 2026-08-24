/**
 * Make the sitemap agree with the pages it lists.
 *
 * @astrojs/sitemap only ever sees a list of URLs, so it knows neither when a
 * piece was written nor whether the page asked to stay out of the index. Both
 * facts are already in the built HTML, so this reads them back from dist rather
 * than reimplementing the slug and threshold rules here, where they would drift
 * from the ones the site actually uses.
 *
 * Two passes over each entry:
 *
 *   dropped   the page carries robots noindex, or it is a forward rather than a
 *             page. Listing a page while asking search engines to skip it is a
 *             contradiction, and listing a redirect argues against the move it
 *             is making. Both resolve themselves when the page changes.
 *   lastmod   the page publishes article:modified_time, so the entry gets it.
 *             A page that declares no date gets no lastmod. Google discards a
 *             sitemap whose dates it cannot trust, so a guess costs more than
 *             the omission.
 *
 * Register after sitemap() in the integrations array, since it rewrites what
 * that integration produces.
 */

import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const MODIFIED_META =
  /<meta\s+property="article:modified_time"\s+content="([^"]+)"/i;
const NOINDEX_META = /<meta\s+name="robots"\s+content="[^"]*noindex/i;
const REFRESH_META = /<meta\s+http-equiv="refresh"/i;

/** The dist file behind a URL, matching how Astro writes static output. */
function fileForUrl(url, site) {
  if (!url.startsWith(site)) return null;
  const path = url.slice(site.length).replace(/^\/+/, "");
  return path === "" ? "index.html" : join(path, "index.html");
}

async function readPage(distDir, url, site) {
  const file = fileForUrl(url, site);
  if (!file) return null;
  try {
    const html = await readFile(join(distDir, file), "utf8");
    return {
      drop: NOINDEX_META.test(html) || REFRESH_META.test(html),
      modified: html.match(MODIFIED_META)?.[1] ?? null,
    };
  } catch {
    return null;
  }
}

export default function sitemapAlign({ site }) {
  const base = site.replace(/\/+$/, "");

  return {
    name: "sitemap-align",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        const distDir = dir.pathname;
        const files = (await readdir(distDir)).filter((name) =>
          /^sitemap-\d+\.xml$/.test(name)
        );

        let dropped = 0;
        let stamped = 0;

        for (const name of files) {
          const path = join(distDir, name);
          const xml = await readFile(path, "utf8");

          // Read every page first, then rewrite in one synchronous pass.
          const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
          const pages = new Map(
            await Promise.all(
              urls.map(async (url) => [url, await readPage(distDir, url, base)])
            )
          );

          const next = xml.replace(/<url>[\s\S]*?<\/url>/g, (block) => {
            const url = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
            const page = url ? pages.get(url) : null;
            if (!page) return block;
            if (page.drop) {
              dropped += 1;
              return "";
            }
            if (page.modified) {
              stamped += 1;
              return block.replace(
                "</loc>",
                `</loc><lastmod>${page.modified}</lastmod>`
              );
            }
            return block;
          });

          if (next !== xml) await writeFile(path, next, "utf8");
        }

        logger.info(
          `sitemap: ${stamped} entries stamped with lastmod, ${dropped} dropped as noindex or forward`
        );
      },
    },
  };
}
