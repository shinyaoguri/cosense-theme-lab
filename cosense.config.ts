import { defineCosenseSite } from "@cosense-site-kit/core";

export default defineCosenseSite({
  site: {
    title: "My Lab",
    description: "Built with cosense-site-kit",
    baseUrl: "https://my-lab.example",
    lang: "ja",
  },

  source: {
    type: "cosense",
    project: "your-lab-project",
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
