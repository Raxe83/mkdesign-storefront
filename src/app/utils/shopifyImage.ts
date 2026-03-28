/**
 * Hängt den Shopify CDN `width`-Parameter an eine Bild-URL an.
 * Shopify liefert das Bild dann bereits server-seitig in der gewünschten Breite,
 * bevor Next.js Image es weiterverarbeitet — drastisch kürzere Download-Zeit.
 *
 * Nicht-Shopify-URLs (z.B. judge.me, cloudinary) werden unverändert zurückgegeben.
 */
export function shopifyImageUrl(url: string | null | undefined, maxWidth: number): string | null {
  if (!url) return null;
  if (!url.includes("cdn.shopify.com")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}width=${maxWidth}`;
}
