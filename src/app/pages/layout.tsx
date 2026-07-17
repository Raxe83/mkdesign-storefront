import React from "react";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // overflow-x-clip statt overflow-x-hidden: "hidden" auf nur einer Achse
    // lässt Browser die andere Achse automatisch auf overflow-y:auto setzen
    // (CSS-Spec-Quirk) — das erzeugt einen eigenen Scroll-Container, der
    // `position: sticky` innerhalb dieses Layouts komplett bricht (betrifft
    // z.B. die sticky Bilder-Galerie auf der Produktseite). "clip" clippt
    // horizontal genauso, ohne diesen Nebeneffekt.
    <div className="pt-16 min-h-screen overflow-x-clip">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {children}
      </div>
    </div>
  );
}
