import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";
import { optionsVirtualModule } from "@cosense-site-kit/theme-utils/integration";
import { pagefindIntegration } from "./integration/pagefind";

export interface ThemeLabNavItem {
  label: string;
  /** Cosense title to link to. */
  page?: string;
  /** Absolute URL or site-relative path (e.g. "/news"). */
  href?: string;
}

export interface ThemeLabOptions {
  /** Site title shown in the header. Falls back to cosense.config.ts site.title. */
  siteTitle?: string;
  /** Default meta description. Falls back to cosense.config.ts site.description. */
  siteDescription?: string;
  /** Header nav items. Falls back to .site `nav:` when empty. */
  nav?: ThemeLabNavItem[];
  /** Cosense title to embed at the top of the home route. */
  homePage?: string;
  /**
   * Tag that marks a Cosense page as a research topic. Pages with this tag
   * are listed on /research and rendered with the research-post template.
   * Default: "research".
   */
  researchTag?: string;
  /**
   * Tag that marks a Cosense page as a news / blog post. Pages with this
   * tag are listed on /news and rendered with the news-post template.
   * Default: "news".
   */
  newsTag?: string;
  /** Affiliation line shown in the footer / header (e.g. "Aichi Institute of Technology"). */
  affiliation?: string;
  /** Copyright owner shown in the footer. Defaults to siteTitle. */
  copyrightHolder?: string;
  /** When set, the copyright holder is rendered as a link to this URL. */
  copyrightUrl?: string;
  /**
   * Visual skin. A preset recolors the theme by overriding the `:root` CSS
   * custom properties (and optionally fonts) — no new templates. Its `options`
   * act as defaults; options passed directly here win. See `presetDark`.
   */
  preset?: ThemeLabPreset;
  /**
   * Full-text search. When true (default), the theme generates a Pagefind
   * index at build time and shows a search box in the header. Set false to
   * skip index generation and hide the box (e.g. tiny sites). The index is
   * built from the static output, so search is available after `astro build`
   * (and `astro preview`), not in `astro dev` until you've built once.
   */
  search?: boolean;
}

/**
 * A skin for theme-lab: pure data, no new .astro. Recolors the theme by
 * overriding the design tokens declared in styles/global.css `:root`.
 */
export interface ThemeLabPreset {
  /** Identifier (e.g. "dark"). Informational; surfaced to a future catalog. */
  name?: string;
  /** CSS custom property overrides, e.g. `{ "--color-bg": "#14181f" }`. */
  tokens?: Record<string, string>;
  /** Sets `<html>` color-scheme so native UI (scrollbars, form fields) matches. */
  colorScheme?: "light" | "dark";
  /** Load a web-font stylesheet. Pair with `--font-*` token overrides. */
  fontHref?: string;
  /** Default theme options the preset ships with; explicit options override. */
  options?: Omit<ThemeLabOptions, "preset">;
}

/** Shape injected into templates via virtual:cosense-theme-lab/options. */
export interface ThemeLabRuntimeOptions {
  siteTitle?: string;
  siteDescription?: string;
  nav: ThemeLabNavItem[];
  homePage?: string;
  researchTag: string;
  newsTag: string;
  affiliation?: string;
  copyrightHolder?: string;
  copyrightUrl?: string;
  tokens: Record<string, string>;
  colorScheme?: "light" | "dark";
  fontHref?: string;
  /** Whether the header search box should render (mirrors index generation). */
  search: boolean;
}

const VIRTUAL_ID = "virtual:cosense-theme-lab/options";

// Merge user options with the chosen preset. Explicit options win; the preset's
// own options fill the gaps. tokens/colorScheme/fontHref come from the preset.
// Pure and exported so it can be unit-tested without spinning up Astro.
export function resolveThemeOptions(opts: ThemeLabOptions = {}): ThemeLabRuntimeOptions {
  const base = opts.preset?.options ?? {};
  return {
    siteTitle: opts.siteTitle ?? base.siteTitle,
    siteDescription: opts.siteDescription ?? base.siteDescription,
    nav: opts.nav ?? base.nav ?? [],
    homePage: opts.homePage ?? base.homePage,
    researchTag: opts.researchTag ?? base.researchTag ?? "research",
    newsTag: opts.newsTag ?? base.newsTag ?? "news",
    affiliation: opts.affiliation ?? base.affiliation,
    copyrightHolder: opts.copyrightHolder ?? base.copyrightHolder,
    copyrightUrl: opts.copyrightUrl ?? base.copyrightUrl,
    tokens: opts.preset?.tokens ?? {},
    colorScheme: opts.preset?.colorScheme,
    fontHref: opts.preset?.fontHref,
    search: opts.search ?? base.search ?? true,
  };
}

export default function themeLab(opts: ThemeLabOptions = {}): AstroIntegration {
  const options = resolveThemeOptions(opts);

  return {
    name: "@cosense-site-kit/theme-lab",
    hooks: {
      "astro:config:setup": ({ injectRoute, updateConfig, config }) => {
        updateConfig({
          vite: { plugins: [optionsVirtualModule(VIRTUAL_ID, options)] },
        });

        // Full-text search: add the Pagefind integration so it indexes the
        // static output at build:done. Guard against double-adding (e.g. the
        // theme included twice) to avoid indexing the site more than once.
        if (
          options.search &&
          !config.integrations.some((i) => i.name === "cosense-theme-lab/pagefind")
        ) {
          updateConfig({ integrations: [pagefindIntegration()] });
        }

        // Vendored theme: .astro templates sit next to this file under theme/,
        // so resolve route entrypoints relative to this source file.
        const here = (p: string) => fileURLToPath(new URL(`./${p}`, import.meta.url));

        // Fixed-route templates: each owns a known URL.
        injectRoute({ pattern: "/", entrypoint: here("templates/home.astro") });
        injectRoute({
          pattern: "/research",
          entrypoint: here("templates/research-index.astro"),
        });
        injectRoute({
          pattern: "/news",
          entrypoint: here("templates/news-index.astro"),
        });
        injectRoute({
          pattern: "/tags/[tag]",
          entrypoint: here("templates/tag.astro"),
        });
        // SEO / discovery endpoints (XML/text/JSON, not pages).
        injectRoute({ pattern: "/sitemap.xml", entrypoint: here("templates/sitemap.xml.ts") });
        injectRoute({ pattern: "/robots.txt", entrypoint: here("templates/robots.txt.ts") });
        injectRoute({ pattern: "/feed.xml", entrypoint: here("templates/feed.xml.ts") });
        // Data for hover/focus link-preview cards (fetched lazily by the client).
        injectRoute({
          pattern: "/link-previews.json",
          entrypoint: here("templates/link-previews.json.ts"),
        });
        // Dispatcher: serves /<slug> and picks the right per-page template.
        injectRoute({
          pattern: "/[...slug]",
          entrypoint: here("templates/_dispatcher.astro"),
        });
      },
    },
  };
}

export { type ActiveSkin, PRESETS, resolveActiveSkin } from "./presets";
export { presetDark } from "./presets/dark";
