import { defineConfig } from "astro/config";
import cosense from "@cosense-site-kit/astro";
// The theme is vendored in this repo (theme/) — edit it freely. Only the
// framework (@cosense-site-kit/*) comes from npm.
import themeLab from "./theme";

export default defineConfig({
  integrations: [
    cosense({ configFile: "./cosense.config.ts" }),
    // Dark skin available: `import themeLab, { presetDark } from "./theme"`
    // then `themeLab({ preset: presetDark })`. Or switch at runtime from
    // Cosense via the `.site` code:site.yaml `theme: { skin: dark }`.
    themeLab(),
  ],
});
