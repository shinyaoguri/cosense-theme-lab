import { defineConfig } from "astro/config";
import cosense from "@cosense-site-kit/astro";
// The theme is vendored in this repo (theme/) — edit it freely. Only the
// framework (@cosense-site-kit/*) comes from npm.
import themeLab from "./theme";

export default defineConfig({
  integrations: [
    cosense({ configFile: "./cosense.config.ts" }),
    themeLab(),
  ],
});
