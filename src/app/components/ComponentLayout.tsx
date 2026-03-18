import React from "react";
import { cn } from "../utils/utils";

function ComponentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ComponentLayout;
