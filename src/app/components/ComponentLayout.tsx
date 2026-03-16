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
    <div className={cn("px-32 flex-1 w-full h-full", className)}>
      {children}
    </div>
  );
}

export default ComponentLayout;
