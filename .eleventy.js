const { DateTime } = require("luxon");

const toUtcDate = (dateValue) => {
  if (dateValue instanceof Date) {
    return DateTime.fromJSDate(dateValue, { zone: "utc" });
  }

  return DateTime.fromISO(String(dateValue), { zone: "utc" });
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("site.webmanifest");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("admin");

  eleventyConfig.addWatchTarget("styles.css");

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("posts/*.md")
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("readableDate", (dateValue) => {
    return toUtcDate(dateValue).toFormat("dd LLL yyyy");
  });

  eleventyConfig.addFilter("htmlDateString", (dateValue) => {
    return toUtcDate(dateValue).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("dateToRfc3339", (dateValue) => {
    return toUtcDate(dateValue).toISO({ suppressMilliseconds: true });
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
