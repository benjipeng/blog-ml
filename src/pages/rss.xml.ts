import rss from "@astrojs/rss";
import {
  articleDescription,
  articlePath,
  articleTopics,
  getPublishedArticles,
  topicLabel,
} from "../lib/content";
import { SITE } from "../lib/site";

export async function GET(context: { site: URL }) {
  const articles = await getPublishedArticles();

  return rss({
    title: `${SITE.name} · ${SITE.alternateName}`,
    description:
      "Writing on machine learning, AI, and engineering from RenoCrypt.",
    site: context.site,
    customData: `<language>${SITE.language}</language>`,
    items: articles.map((article) => ({
      title: article.data.title,
      description: articleDescription(article),
      pubDate: article.data.date,
      link: articlePath(article),
      categories: articleTopics(article).map(topicLabel),
    })),
  });
}
