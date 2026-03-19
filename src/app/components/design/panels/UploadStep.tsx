"use client";

import { Check, Loader2 } from "lucide-react";
import { cn } from "@/app/utils/utils";

type Props = { label: string; done: boolean; active: boolean };

export function UploadStep({ label, done, active }: Props) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={cn(
        "flex h-4 w-4 items-center justify-center rounded-full flex-shrink-0 transition-colors duration-300",
        done && "bg-rust",
        active && "bg-rust/30",
        !done && !active && "bg-stone-200 dark:bg-zinc-700",
      )}>
        {done   && <Check   size={9} className="text-white" />}
        {active && <Loader2 size={9} className="animate-spin text-rust" />}
      </span>
      <span className={cn(
        "transition-colors duration-200",
        done || active ? "text-primary dark:text-cream" : "text-muted",
      )}>
        {label}
      </span>
    </div>
  );
}
