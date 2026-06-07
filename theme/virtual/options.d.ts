declare module "virtual:cosense-theme-lab/options" {
  export interface ThemeLabNavItem {
    label: string;
    page?: string;
    href?: string;
  }
  export interface ThemeLabRuntimeOptions {
    siteTitle?: string;
    siteDescription?: string;
    nav: ThemeLabNavItem[];
    homePage?: string;
    newsTag: string;
    affiliation?: string;
    copyrightHolder?: string;
    copyrightUrl?: string;
    tokens: Record<string, string>;
    colorScheme?: "light" | "dark";
    fontHref?: string;
    search: boolean;
  }
  const options: ThemeLabRuntimeOptions;
  export default options;
}
