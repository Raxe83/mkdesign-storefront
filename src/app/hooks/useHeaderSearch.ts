"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import type { Product } from "../types/shopify";
import { shopDetails } from "../global";
import { shipment } from "../types/products";

export type SearchResultType = "product" | "page" | "info";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  subtitle?: string;
  href: string;
  imageUrl?: string | null;
}

const STATIC_ENTRIES: SearchResult[] = [
  {
    type: "page",
    title: "Versand & Lieferung",
    subtitle: `Standard ${shipment.standard.days} Tage (${shipment.standard.price}€) · Express ${shipment.premium.days} Tage (${shipment.premium.price}€)`,
    href: "/pages/shipping",
  },
  {
    type: "page",
    title: "Lieferzeiten",
    subtitle: "Aktuelle Lieferzeiten einsehen",
    href: "/pages/delivery-time",
  },
  {
    type: "info",
    title: "E-Mail",
    subtitle: shopDetails.contact.email,
    href: `mailto:${shopDetails.contact.email}`,
  },
  {
    type: "info",
    title: "Telefon",
    subtitle: shopDetails.contact.phone,
    href: `tel:${shopDetails.contact.phone}`,
  },
  {
    type: "info",
    title: "Adresse",
    subtitle: `${shopDetails.contact.address}, ${shopDetails.contact.city}, ${shopDetails.contact.country}`,
    href: "/pages/contact",
  },
  {
    type: "page",
    title: "Kontakt",
    subtitle: "Schreib uns eine Nachricht",
    href: "/pages/contact",
  },
  {
    type: "page",
    title: "Eigenes Design",
    subtitle: "Gestalte dein individuelles Produkt",
    href: "/pages/design",
  },
  {
    type: "page",
    title: "Alle Produkte",
    subtitle: "Komplette Produktübersicht",
    href: "/pages/products",
  },
  {
    type: "page",
    title: "Kategorien",
    subtitle: "Produkte nach Kategorie durchsuchen",
    href: "/pages/categories",
  },
  {
    type: "page",
    title: "Über uns",
    subtitle: "Lerne M.K. Design kennen",
    href: "/pages/aboutus",
  },
  {
    type: "page",
    title: "Impressum",
    subtitle: "Rechtliche Angaben",
    href: "/pages/imprint",
  },
  {
    type: "page",
    title: "Datenschutz",
    subtitle: "Datenschutzerklärung",
    href: "/pages/privacy",
  },
  {
    type: "page",
    title: "AGB",
    subtitle: "Allgemeine Geschäftsbedingungen",
    href: "/pages/tos",
  },
];

// Alias-Wörter → zugehörige Entry-Titel
const ALIASES: Record<string, string[]> = {
  versand: ["Versand & Lieferung", "Lieferzeiten"],
  lieferung: ["Versand & Lieferung", "Lieferzeiten"],
  lieferzeit: ["Lieferzeiten"],
  shipping: ["Versand & Lieferung"],
  email: ["E-Mail", "Kontakt"],
  mail: ["E-Mail", "Kontakt"],
  telefon: ["Telefon", "Kontakt"],
  phone: ["Telefon"],
  adresse: ["Adresse", "Kontakt"],
  standort: ["Adresse"],
  kontakt: ["Kontakt", "E-Mail", "Telefon"],
  contact: ["Kontakt"],
  design: ["Eigenes Design"],
  produkt: ["Alle Produkte"],
  kategorie: ["Kategorien"],
  impressum: ["Impressum"],
  datenschutz: ["Datenschutz"],
  agb: ["AGB"],
  "über": ["Über uns"],
  about: ["Über uns"],
};

function matches(text: string, q: string): boolean {
  return text.toLowerCase().includes(q.toLowerCase());
}

export interface SearchGroups {
  products: SearchResult[];
  info: SearchResult[];
}

export function useHeaderSearch(query: string): {
  results: SearchGroups;
  productsLoaded: boolean;
} {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    if (!domain || !token) { setProductsLoaded(true); return; }

    fetch(`https://${domain}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
        "Accept-Language": "de",
      },
      body: JSON.stringify({
        query: `query {
          products(first: 250) {
            edges {
              node {
                id title handle description productType tags
                priceRange { minVariantPrice { amount currencyCode } }
                featuredImage { url altText }
                variants(first: 1) { edges { node { availableForSale } } }
              }
            }
          }
        }`,
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        const nodes = json?.data?.products?.edges?.map(
          (e: { node: Product }) => e.node
        ) ?? [];
        setAllProducts(nodes);
      })
      .catch(() => {})
      .finally(() => setProductsLoaded(true));
  }, []);

  const results = useMemo((): SearchGroups => {
    const q = query.trim();
    if (!q) return { products: [], info: [] };

    const products: SearchResult[] = allProducts
      .filter(
        (p) =>
          matches(p.title, q) ||
          matches(p.description, q) ||
          matches(p.productType, q) ||
          p.tags.some((t) => matches(t, q))
      )
      .map((p) => ({
        type: "product" as const,
        title: p.title,
        subtitle: `${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2).replace(".", ",")} ${p.priceRange.minVariantPrice.currencyCode}`,
        href: `/pages/products/${p.handle}`,
        imageUrl: p.featuredImage?.url ?? null,
      }));

    const qLow = q.toLowerCase();
    const priority = new Set<string>();
    Object.keys(ALIASES).forEach((alias) => {
      if (qLow.includes(alias) || alias.includes(qLow)) {
        ALIASES[alias].forEach((t) => priority.add(t));
      }
    });

    const info: SearchResult[] = STATIC_ENTRIES.filter(
      (e) =>
        priority.has(e.title) ||
        matches(e.title, q) ||
        matches(e.subtitle ?? "", q)
    ).slice(0, 5);

    return { products, info };
  }, [query, allProducts]);

  return { results, productsLoaded };
}
