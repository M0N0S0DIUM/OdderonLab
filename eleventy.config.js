const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const { DateTime } = require("luxon");
const nunjucks = require("nunjucks");

// ========================================
// CREATE NUNJUCKS ENVIRONMENT WITH FILTERS PRE-REGISTERED
// ========================================
const nunjucksEnv = nunjucks.configure({ autoescape: true });

const dateFilter = (dateObj, format = "MMMM yyyy") => {
  if (!dateObj) return "";
  const dt = typeof dateObj === "string" ? DateTime.fromISO(dateObj, {zone: 'utc'}) : DateTime.fromJSDate(dateObj, {zone: 'utc'});
  return dt.isValid ? dt.toFormat(format) : "";
};
const dateIsoFilter = (date) => {
  if (!date) return "";
  return new Date(date).toISOString();
};

nunjucksEnv.addFilter("date", dateFilter);
nunjucksEnv.addFilter("dateIso", dateIsoFilter);

module.exports = function(eleventyConfig) {
  // ========================================
  // USE PRE-CONFIGURED NUNJUCKS ENVIRONMENT
  // ========================================
  eleventyConfig.setLibrary("njk", nunjucksEnv);

  // Also register as universal filters
  eleventyConfig.addFilter("date", dateFilter);
  eleventyConfig.addFilter("dateIso", dateIsoFilter);

  // Plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  // Markdown config
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
    level: [1, 2, 3, 4],
    slugify: (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("posts/*.md").sort((a, b) => b.date - a.date);
  });

  // Passthrough copies
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy({ "_redirects": "/" });

  // Watch targets
  eleventyConfig.addWatchTarget("styles.css");

  // Base config
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};