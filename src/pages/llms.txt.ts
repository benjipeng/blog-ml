/**
 * llms.txt: the site, addressed to a model rather than a browser.
 *
 * It is generated from the same collections the pages are built from, so it
 * cannot fall behind the site the way a hand-written index would. The format
 * follows llmstxt.org: one H1, a blockquote summary, then lists of links with
 * a sentence each.
 */

import type { APIRoute } from "astro";
import {
  articleDescription,
  articlePath,
  articleTopics,
  byDateDesc,
  getPublishedArticles,
  getIndexedTopics,
  sectionMeta,
  topicLabel,
  type ArticleEntry,
  type ArticleSection,
} from "../lib/content";
import { SITE, AUTHOR, SIBLING, absolute } from "../lib/site";

const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

function articleLine(entry: ArticleEntry) {
  const parts = [
    `- [${oneLine(entry.data.title)}](${absolute(articlePath(entry))})`,
    `${oneLine(articleDescription(entry))}`,
  ];
  const meta = [`published ${isoDate(entry.data.date)}`];
  if (entry.data.updated) meta.push(`updated ${isoDate(entry.data.updated)}`);
  const topics = articleTopics(entry).map(topicLabel);
  if (topics.length) meta.push(`topics: ${topics.join(", ")}`);
  return `${parts.join(": ")} (${meta.join("; ")})`;
}

export const GET: APIRoute = async () => {
  const articles = await getPublishedArticles();
  const topics = await getIndexedTopics();

  const sections: ArticleSection[] = ["posts", "dev", "ciphers"];
  const bySection = sections
    .map((section) => ({
      meta: sectionMeta[section],
      entries: articles
        .filter((entry) => entry.collection === section)
        .sort(byDateDesc),
    }))
    .filter((group) => group.entries.length > 0);

  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.alternateName}. Long-form technical writing on machine learning, AI, and engineering, from the mathematics inside a model through to the systems that run it.`,
    "",
    `Written by ${AUTHOR.name}. Every piece carries the derivation, the benchmark, or the working code behind its claims, so a result can be checked rather than taken on trust.`,
    "",
  ];

  for (const group of bySection) {
    lines.push(`## ${group.meta.label}`, "");
    lines.push(oneLine(group.meta.description), "");
    lines.push(...group.entries.map(articleLine), "");
  }

  if (topics.length) {
    lines.push("## Topics", "");
    lines.push(
      "The threads the writing returns to. A topic has a page once a second piece joins it.",
      ""
    );
    lines.push(
      ...topics.map(
        (topic) =>
          `- [${topicLabel(topic.name)}](${absolute(`/topics/${topic.slug}/`)}): ${topic.entries.length} pieces.`
      ),
      ""
    );
  }

  lines.push(
    "## Reference",
    "",
    `- [About](${absolute("/about/")}): who writes this, and the background behind it.`,
    `- [RSS feed](${absolute("/rss.xml")}): every piece, newest first.`,
    `- [${SIBLING.name}](${SIBLING.url}): the software side of the same brand.`,
    "",
    "## Notes",
    "",
    "- The site is a static build with no API and no paywall. Every page above is public HTML.",
    "- Mathematics is written in LaTeX and rendered with KaTeX, so equations are selectable text rather than images.",
    "- Code samples are complete enough to run, not fragments quoted out of a larger file.",
    `- Dates are ISO 8601. A piece that has been revised carries both its publication and revision date.`,
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
