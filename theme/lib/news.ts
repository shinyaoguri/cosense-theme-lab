import type { CosenseBlock, InlineNode } from "@cosense-site-kit/core";

export interface NewsSummary {
  title: string;
  slug: string;
  description: string;
  date: Date | null;
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
