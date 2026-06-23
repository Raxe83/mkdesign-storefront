"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackPageView, initShopifyAnalytics } from "../utils/shopifyAnalytics";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => { initShopifyAnalytics(); }, []);

  useEffect(() => {
    const url = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    trackPageView(url, document.title);

    const onConsentGranted = () => trackPageView(url, document.title);
    window.addEventListener("cookie-consent-updated", onConsentGranted);
    return () =>
      window.removeEventListener("cookie-consent-updated", onConsentGranted);
  }, [pathname, searchParams]);

  return null;
}
