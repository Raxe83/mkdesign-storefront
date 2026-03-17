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
    <div className={cn("px-4 sm:px-6 lg:px-[5vw] flex-1 w-full h-full", className)}>
      {children}
    </div>
  );
}

export default ComponentLayout;
