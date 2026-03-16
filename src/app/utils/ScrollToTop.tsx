'use client'

import { useEffect } from "react";
import { usePathname } from 'next/navigation';

const ScrollToTop = () => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scrollt nach oben
  }, [pathname]); // Bei Änderung der Route wird nach oben gescrollt

  return null; // Keine UI-Komponente wird gerendert
};

export default ScrollToTop;
