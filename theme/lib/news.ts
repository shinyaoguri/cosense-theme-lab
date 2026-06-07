import type { CosenseBlock, InlineNode } from "@cosense-site-kit/core";
import { isPublicTag } from "@cosense-site-kit/theme-utils";

export interface NewsSummary {
  title: string;
  slug: string;
  description: string;
  date: Date | null;
  /** First image in the page body (core's resolved `image`), used as the
   *  list thumbnail. Absent when the page has no images. */
  image?: string;
  /** Public tags on the page (control/date tags filtered out). The news tag
   *  itself stays in here — strip it at the call site if it's redundant. */
  tags: string[];
}

function inlineToText(nodes: InlineNode[]): string {
  let out = "";
  for (const n of nodes) {
    switch (n.type) {
      case "text":
        out += n.value;
        break;
      case "strong":
      case "emphasis":
      case "strikethrough":
      case "link":
        out += inlineToText(n.children);
        break;
      case "code":
      case "formula":
        out += n.value;
        break;
      case "pageLink":
        out += n.title;
        break;
      default:
        break;
    }
  }
  return out;
}

function firstParagraph(blocks: CosenseBlock[]): string {
  for (const b of blocks) {
    if (b.type === "paragraph") {
      const t = inlineToText(b.children).trim();
      if (t.length > 0) return t;
    }
  }
  return "";
}

export function newsSummary(entry: {
  data: {
    title: string;
    slug: string;
    summary?: string;
    blocks: CosenseBlock[];
    publishedAt?: string;
    modifiedAt?: string;
    image?: string;
    tags: string[];
  };
}): NewsSummary {
  const description = entry.data.summary?.trim() || firstParagraph(entry.data.blocks);
  // Resolved display dates: publishedAt honours a `#published/YYYY-MM-DD` tag
  // and falls back to the Cosense created timestamp (see core's page schema).
  const iso = entry.data.publishedAt ?? entry.data.modifiedAt ?? null;
  return {
    title: entry.data.title,
    slug: entry.data.slug,
    description,
    date: iso ? new Date(iso) : null,
    image: entry.data.image?.trim() || undefined,
    tags: entry.data.tags.filter(isPublicTag),
  };
}

export function formatNewsDate(d: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
