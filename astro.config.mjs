import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import sitemapAlign from "./tools/sitemap-align.mjs";

const site = "https://www.renocrypt.com";

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: "ignore",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    mdx(),
    // /tags/ and /categories/ exist only to forward the old taxonomy URLs to
    // /topics/. They are redirects, not destinations, so keep them out of the
    // sitemap — listing a redirect there argues against the move.
    sitemap({
      filter: (page) =>
        !/\/(tags|categories)(\/|$)/.test(new URL(page).pathname),
    }),
    // Reads the built pages back and reconciles the sitemap with what they
    // declare: lastmod from each article, and no entry for a page that asked
    // not to be indexed. Must follow sitemap(), which it rewrites.
    sitemapAlign({ site }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    syntaxHighlight: "shiki",
    shikiConfig: {
      // Code blocks live on ink; this theme reads well there.
      theme: "github-dark-default",
      wrap: false,
    },
  },
});
