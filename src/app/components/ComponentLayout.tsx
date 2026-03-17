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
        "px-6 md:px-10 lg:px-32 mx-auto flex-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default ComponentLayout;
