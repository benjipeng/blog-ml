import { getCollection, type CollectionEntry } from "astro:content";

export type ArticleEntry =
  | CollectionEntry<"posts">
  | CollectionEntry<"dev">
  | CollectionEntry<"ciphers">;
export type ArticleSection = ArticleEntry["collection"];

export const sectionMeta: Record<
  ArticleSection,
  { label: string; eyebrow: string; href: string; description: string }
> = {
  posts: {
    label: "ML/AI",
    eyebrow: "models",
    href: "/posts/",
    description:
      "Machine learning notes, model architecture explainers, and practical AI write-ups.",
  },
  dev: {
    label: "Development",
    eyebrow: "machines",
    href: "/dev/",
    description:
      "Engineering notes on systems, infrastructure, agents, and tools that ship.",
  },
  ciphers: {
    label: "Ciphers",
    eyebrow: "ciphers",
    href: "/ciphers/",
    description:
      "Security research notes: how systems break, how they hold, and the cryptography underneath.",
  },
};

export const byDateDesc = (a: ArticleEntry, b: ArticleEntry) =>
  b.data.date.valueOf() - a.data.date.valueOf();

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

export function normalizePath(path: string) {
  const clean = path.trim().replace(/^\/+|\/+$/g, "");
  return `/${clean}/`;
}

export function slugFromId(id: string) {
  return id
    .replace(/\.(md|mdx)$/i, "")
    .replace(/\/(?:index|_index)$/i, "")
    .replace(/(?:^|\/)_index$/i, "")
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("/");
}

export function articlePath(entry: ArticleEntry) {
  if (entry.data.url) return normalizePath(entry.data.url);
  return normalizePath(`${entry.collection}/${slugFromId(entry.id)}`);
}

export function articleDescription(entry: ArticleEntry) {
  return (
    entry.data.description ||
    `${sectionMeta[entry.collection].label} writing from RenoCrypt.`
  );
}

export function wordCount(entry: ArticleEntry) {
  const body = "body" in entry ? (entry.body ?? "") : "";
  return body.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(entry: ArticleEntry) {
  return Math.max(1, Math.ceil(wordCount(entry) / 225));
}

export function articleTopics(entry: ArticleEntry) {
  return [...new Set([...entry.data.categories, ...entry.data.tags])].filter(
    Boolean
  );
}

export async function getPublishedArticles() {
  const [posts, dev, ciphers] = await Promise.all([
    getCollection("posts", ({ data }) => !data.draft),
    getCollection("dev", ({ data }) => !data.draft),
    getCollection("ciphers", ({ data }) => !data.draft),
  ]);
  return [...posts, ...dev, ...ciphers].sort(byDateDesc);
}

export function topicSlug(topic: string) {
  return topic
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A topic earns a page once a second piece joins it.
 *
 * A one-article topic page is a copy of that article's card and nothing else,
 * so it competes with the article it points at and adds a thin page to the
 * index. Below the threshold the label still shows on the article, it simply
 * stops being a link to a page that says nothing new.
 */
export const MIN_TOPIC_ARTICLES = 2;

export interface TopicBucket {
  slug: string;
  name: string;
  entries: ArticleEntry[];
}

/** Every topic across the published set, most-written first, then alphabetical. */
export async function getTopicBuckets(): Promise<TopicBucket[]> {
  const articles = await getPublishedArticles();
  const buckets = new Map<string, TopicBucket>();

  for (const entry of articles) {
    for (const topic of articleTopics(entry)) {
      const slug = topicSlug(topic);
      if (!slug) continue;
      const bucket = buckets.get(slug) ?? { slug, name: topic, entries: [] };
      bucket.entries.push(entry);
      buckets.set(slug, bucket);
    }
  }

  return [...buckets.values()].sort(
    (a, b) => b.entries.length - a.entries.length || a.name.localeCompare(b.name)
  );
}

/** The topics that have a page: the ones at or above the threshold. */
export async function getIndexedTopics(): Promise<TopicBucket[]> {
  const buckets = await getTopicBuckets();
  return buckets.filter((bucket) => bucket.entries.length >= MIN_TOPIC_ARTICLES);
}

/** Slugs of the topics that have a page, for deciding what to link. */
export async function getIndexedTopicSlugs(): Promise<Set<string>> {
  return new Set((await getIndexedTopics()).map((bucket) => bucket.slug));
}

/** A topic reads as "machine learning", not "machine-learning". */
export const topicLabel = (topic: string) => topic.replace(/-/g, " ");

