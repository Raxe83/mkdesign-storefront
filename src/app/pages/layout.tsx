import React from "react";

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        {children}
      </div>
    </div>
  );
}
