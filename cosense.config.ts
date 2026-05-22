import { defineCosenseSite } from "@cosense-site-kit/core";

export default defineCosenseSite({
  site: {
    title: "cosense-theme-lab",
    description: "cosense-theme-lab is a theme of cosense-site-kit",
    baseUrl: "https://shinyaoguri.github.io",
    base: "/cosense-theme-lab",
    lang: "ja",
  },

  source: {
    type: "cosense",
    project: "cosense-site-lab",
  },

  publish: {
    default: "none",
    includeTags: ["publish"],
    excludeTags: ["draft", "private", "internal"],
  },

  routing: {
    slug: "metadata-or-encoded-title",
  },

  deploy: {
    target: "github-pages",
    schedule: "17 1,13 * * *",
  },
});
