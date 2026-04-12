/**
 * Minimal HTML sanitizers for Shopify Metaobject content.
 * No external deps — regex-based, works in both server and client contexts.
 */

/** Tags that need their content removed along with the tag itself */
const BLOCK_REMOVE_RE =
  /<(script|style|iframe|object|embed|form)\b[\s\S]*?<\/\1>/gi;

/** Strip event handler attributes from any tag */
const EVENT_ATTR_RE = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;

/** Allowed tags for inline / title-level HTML (no attributes) */
const INLINE_TAGS = new Set(["em", "strong", "b", "i", "br", "span"]);

/** Allowed tags + their permitted attributes for rich product descriptions */
const RICH_TAGS: Record<string, string[]> = {
  p: [],
  br: [],
  strong: [],
  em: [],
  b: [],
  i: [],
  ul: [],
  ol: [],
  li: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  span: ["class"],
  a: ["href", "title", "target", "rel"],
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function stripBlockContent(html: string): string {
  return html.replace(BLOCK_REMOVE_RE, "");
}

function stripEventAttrs(html: string): string {
  return html.replace(EVENT_ATTR_RE, "");
}

/**
 * Filter a tag's attribute string down to only the allowed attribute names.
 * Returns the rebuilt opening tag.
 */
function keepAttrs(tag: string, attrs: string, allowed: string[]): string {
  if (allowed.length === 0) return `<${tag}>`;
  const kept: string[] = [];
  const attrRe = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = attrRe.exec(attrs)) !== null) {
    const name = m[1].toLowerCase();
    if (!allowed.includes(name)) continue;
    const val = m[2] ?? m[3] ?? m[4] ?? "";
    // Block javascript: hrefs
    if (name === "href" && /^\s*javascript:/i.test(val)) continue;
    kept.push(`${name}="${val}"`);
  }
  return kept.length ? `<${tag} ${kept.join(" ")}>` : `<${tag}>`;
}

// ─── public API ───────────────────────────────────────────────────────────────

/**
 * For Metaobject **title** fields.
 * Allows: <em>, <strong>, <b>, <i>, <br>, <span> — all without attributes.
 * Strips everything else.
 */
export function sanitizeInlineHtml(html: string): string {
  let s = stripBlockContent(html);
  s = stripEventAttrs(s);
  s = s.replace(/<\/?([\w]+)\b([^>]*)\/?>/g, (_match, tag: string, _attrs: string) => {
    const t = tag.toLowerCase();
    if (!INLINE_TAGS.has(t)) return "";
    if (t === "br") return "<br/>";
    return _match.startsWith("</") ? `</${t}>` : `<${t}>`;
  });
  return s;
}

/**
 * For Shopify **descriptionHtml** and other rich text fields.
 * Allows a curated set of block + inline tags with safe attributes.
 */
export function sanitizeRichHtml(html: string): string {
  let s = stripBlockContent(html);
  s = stripEventAttrs(s);
  s = s.replace(/<(\/?)([a-z][\w]*)\b([^>]*)>/gi, (_match, close: string, tag: string, attrs: string) => {
    const t = tag.toLowerCase();
    if (!(t in RICH_TAGS)) return "";
    if (close) return `</${t}>`;
    return keepAttrs(t, attrs, RICH_TAGS[t]);
  });
  return s;
}
