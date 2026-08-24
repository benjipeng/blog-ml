/**
 * Site-level constants.
 *
 * Anything that names the site, its author, or its publisher belongs here, so
 * the head tags, the structured data, the feed, and llms.txt all describe the
 * site the same way. A value repeated in two places drifts in one of them.
 */

export const SITE = {
  name: "RenoCrypt",
  alternateName: "Matrix Alchemy",
  url: "https://www.renocrypt.com",
  language: "en",
  locale: "en_US",
  /** Used wherever a page does not set its own. */
  title: "RenoCrypt · Matrix Alchemy",
  description:
    "Matrix Alchemy. Writing on machine learning, AI, and engineering by RenoCrypt.",
  /** The home page earns its own pair, because it competes on the subject, not the name. */
  homeTitle: "RenoCrypt · Machine Learning, AI, and Engineering",
  homeDescription:
    "Long-form technical writing on machine learning, AI, and engineering. Model internals, systems that ship, and security research, with the math shown.",
  ogImage: "/og.png",
  /** Raster logo for structured data. Google ignores SVG here. */
  logo: "/apple-touch-icon.png",
} as const;

export const AUTHOR = {
  name: "Benji Peng",
  shortName: "Benji",
  url: "https://github.com/benjipeng",
} as const;

/** The software side of the brand, linked from the footer and named in llms.txt. */
export const SIBLING = {
  name: "App Automaton",
  url: "https://appautomaton.renocrypt.com/",
} as const;

export const absolute = (path: string) => new URL(path, SITE.url).href;
