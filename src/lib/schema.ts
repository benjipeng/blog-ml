/**
 * Structured data for the pages that are lists.
 *
 * Every index on the site says the same thing in schema terms: this page is a
 * collection, it belongs to the site, and here is what is on it in order. That
 * shape is written once here so the five list pages cannot drift apart.
 */

import { articlePath, type ArticleEntry } from "./content";
import { SITE, absolute } from "./site";

/** The articles on a page, in the order the page shows them. */
export function articleItemList(entries: ArticleEntry[]) {
  return {
    "@type": "ItemList",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absolute(articlePath(entry)),
      name: entry.data.title,
    })),
  };
}

/** A named list of links, used where the items are not articles. */
export function linkItemList(items: { name: string; path: string }[]) {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absolute(item.path),
      name: item.name,
    })),
  };
}

export function collectionPage({
  name,
  path,
  description,
  mainEntity,
}: {
  name: string;
  path: string;
  description?: string;
  mainEntity: ReturnType<typeof articleItemList | typeof linkItemList>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} · ${SITE.name}`,
    url: absolute(path),
    inLanguage: SITE.language,
    isPartOf: { "@id": `${SITE.url}/#website` },
    ...(description ? { description } : {}),
    mainEntity,
  };
}
