import { shopifyFetch } from "./client";
import type {
  CmsAnnouncement,
  CmsHomepageHero,
  CmsSectionText,
  Metaobject,
} from "../../types/shopify";

// ─── Generic Metaobject query (used by getExtraInfoByType) ────────────────────

const METAOBJECT_QUERY = `
  query getMetaobjectsByType($type: String!) {
    metaobjects(type: $type, first: 10) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            type
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface MetaobjectResponse {
  metaobjects: { edges: Array<{ node: Metaobject }> };
}

/**
 * Fetch category-specific extra info from a Shopify Metaobject.
 * Builds the type as `{category}_extra_info` (hyphens → underscores).
 * Cached via Next.js ISR (revalidates every hour).
 */
export async function getExtraInfoByType(
  category: string,
): Promise<Metaobject[]> {
  const metaobjectType = `${category.replace(/-/g, "_")}_extra_info`;
  try {
    const data = await shopifyFetch<MetaobjectResponse>({
      query: METAOBJECT_QUERY,
      variables: { type: metaobjectType },
      revalidate: 3600,
    });
    return data.metaobjects.edges.map((e) => e.node);
  } catch {
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type RawField = {
  key: string;
  value: string | null;
  reference?: {
    /** MediaImage (file_reference) */
    image?: { url: string; altText: string | null } | null;
    /** Metaobject reference (e.g. cms_route) */
    fields?: Array<{ key: string; value: string | null }> | null;
  } | null;
};

function fieldValue(fields: RawField[], key: string): string | null {
  return fields.find((f) => f.key === key)?.value ?? null;
}

function fieldImage(
  fields: RawField[],
  key: string,
): { url: string; altText: string | null } | null {
  return fields.find((f) => f.key === key)?.reference?.image ?? null;
}

/** Resolves a metaobject_reference field and returns the `value` field of the linked cms_route. */
function fieldRouteValue(fields: RawField[], key: string): string | null {
  const refFields = fields.find((f) => f.key === key)?.reference?.fields;
  if (!refFields) return null;
  return refFields.find((f) => f.key === "value")?.value ?? null;
}

// Shared field fragment — covers text values, MediaImage and Metaobject (route) references.
const FIELDS_FRAGMENT = `
  key
  value
  reference {
    ... on MediaImage {
      image { url altText }
    }
    ... on Metaobject {
      fields { key value }
    }
  }
`;

// ─── Announcement Bar ─────────────────────────────────────────────────────────
//
// Shopify MetaObject type:  cms_announcement
// Fields:
//   title          single_line_text_field
//   content        single_line_text_field
//   message_type   single_line_text_field   ("sticky" | "important" | "promo")
//   is_active      boolean
//
// Create one MetaObject per bar item in Shopify Admin → Content → Metaobjects.

const ANNOUNCEMENTS_QUERY = `
  query getCmsAnnouncements {
    metaobjects(type: "cms_announcement", first: 20) {
      edges {
        node {
          id
          fields { key value }
        }
      }
    }
  }
`;

interface AnnouncementsResponse {
  metaobjects: {
    edges: Array<{ node: { id: string; fields: RawField[] } }>;
  };
}

/** Returns all active announcement items. ISR: 5-minute cache. */
export async function getAnnouncementBarItems(): Promise<CmsAnnouncement[]> {
  try {
    const data = await shopifyFetch<AnnouncementsResponse>({
      query: ANNOUNCEMENTS_QUERY,
      revalidate: 300,
    });
    const items: CmsAnnouncement[] = [];
    for (const { node } of data.metaobjects.edges) {
      const f = node.fields;
      if (fieldValue(f, "is_active") !== "true") continue;
      items.push({
        id: node.id,
        title: fieldValue(f, "title") ?? "",
        content: fieldValue(f, "content") ?? "",
        messageType:
          (fieldValue(f, "message_type") as CmsAnnouncement["messageType"]) ??
          "sticky",
        isActive: true,
      });
    }
    return items;
  } catch {
    return [];
  }
}

// ─── Homepage Hero ─────────────────────────────────────────────────────────────
//
// Shopify MetaObject type:  cms_homepage_hero
// Handle:                   main   (singleton)
// Fields:
//   eyebrow               single_line_text_field
//   title                 single_line_text_field   (may contain HTML)
//   description           multi_line_text_field
//   cta_primary_label     single_line_text_field
//   cta_primary_route     metaobject_reference → cms_route
//   cta_secondary_label   single_line_text_field
//   cta_secondary_route   metaobject_reference → cms_route
//   stat_collections      single_line_text_field   (e.g. "25+")
//   stat_craftsmanship    single_line_text_field   (e.g. "100%")
//   image                 file_reference           (hero image)

const HOMEPAGE_HERO_QUERY = `
  query getCmsHomepageHero {
    metaobjects(type: "cms_homepage_hero", first: 1) {
      edges {
        node {
          id
          fields { ${FIELDS_FRAGMENT} }
        }
      }
    }
  }
`;

interface HomepageHeroResponse {
  metaobjects: { edges: Array<{ node: { id: string; fields: RawField[] } }> };
}

/** Returns hero CMS content, or null when MetaObject doesn't exist yet. ISR: 1h. */
export async function getHomepageHero(): Promise<CmsHomepageHero | null> {
  try {
    const data = await shopifyFetch<HomepageHeroResponse>({
      query: HOMEPAGE_HERO_QUERY,
      revalidate: 3600,
    });
    const first = data.metaobjects.edges[0];
    if (!first) return null;
    const f = first.node.fields;
    return {
      eyebrow: fieldValue(f, "eyebrow"),
      title: fieldValue(f, "title"),
      description: fieldValue(f, "description"),
      ctaPrimaryLabel: fieldValue(f, "cta_primary_label"),
      ctaPrimaryHref: fieldRouteValue(f, "cta_primary_route"),
      ctaSecondaryLabel: fieldValue(f, "cta_secondary_label"),
      ctaSecondaryHref: fieldRouteValue(f, "cta_secondary_route"),
      statCollections: fieldValue(f, "stat_collections"),
      statCraftsmanship: fieldValue(f, "stat_craftsmanship"),
      imageUrl: fieldImage(f, "image")?.url ?? null,
      imageAlt: fieldImage(f, "image")?.altText ?? null,
    };
  } catch {
    return null;
  }
}

// ─── Section Text ─────────────────────────────────────────────────────────────
//
// Shopify MetaObject type:  cms_section_text
// Fields:
//   section_handle  single_line_text_field   (identifier, e.g. "fire-highlight")
//   section_label   single_line_text_field   (eyebrow label)
//   title           single_line_text_field   (may contain HTML)
//   description     multi_line_text_field
//   cta_label       single_line_text_field
//   cta_href_route  metaobject_reference → cms_route
//   features_json   list.single_line_text_field  (Shopify list → JSON array string)
//   image           file_reference           (section image)
//
// Note: section_handle is a custom field, not the MetaObject system handle.
// All objects are fetched at once and filtered by section_handle client-side.

const SECTION_TEXTS_QUERY = `
  query getCmsSectionTexts {
    metaobjects(type: "cms_section_text", first: 20) {
      edges {
        node {
          id
          fields { ${FIELDS_FRAGMENT} }
        }
      }
    }
  }
`;

interface SectionTextsResponse {
  metaobjects: { edges: Array<{ node: { id: string; fields: RawField[] } }> };
}

function parseSectionNode(fields: RawField[]): CmsSectionText {
  const featuresRaw = fieldValue(fields, "features_json");
  let features: string[] = [];
  if (featuresRaw) {
    try {
      features = JSON.parse(featuresRaw) as string[];
    } catch {
      features = [];
    }
  }
  return {
    sectionLabel: fieldValue(fields, "section_label"),
    title: fieldValue(fields, "title"),
    description: fieldValue(fields, "description"),
    ctaLabel: fieldValue(fields, "cta_label"),
    ctaHref: fieldRouteValue(fields, "cta_href_route"),
    features,
    imageUrl: fieldImage(fields, "image")?.url ?? null,
    imageAlt: fieldImage(fields, "image")?.altText ?? null,
  };
}

/**
 * Returns section text CMS content matched by the `section_handle` field,
 * or null when no matching MetaObject exists. ISR: 1h.
 *
 * @example
 *   getSectionText("fire-highlight")
 *   getSectionText("print-highlight")
 */
export async function getSectionText(
  sectionHandle: string,
): Promise<CmsSectionText | null> {
  try {
    const data = await shopifyFetch<SectionTextsResponse>({
      query: SECTION_TEXTS_QUERY,
      revalidate: 3600,
    });
    const match = data.metaobjects.edges.find(
      ({ node }) => fieldValue(node.fields, "section_handle") === sectionHandle,
    );
    if (!match) return null;
    return parseSectionNode(match.node.fields);
  } catch {
    return null;
  }
}
