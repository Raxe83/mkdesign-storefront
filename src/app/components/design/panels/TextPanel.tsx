"use client";

import { Type } from "lucide-react";
import { cn } from "@/app/utils/utils";

type Props = {
  onAddText: () => void;
};

export function TextPanel({ onAddText }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onAddText}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded",
          "border border-stone-200/80 dark:border-zinc-700",
          "text-sm font-medium text-stone dark:text-muted",
          "hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 hover:text-rust",
          "transition-all duration-200 cursor-pointer active:scale-[0.98]",
        )}
      >
        <Type size={15} /> Text hinzufügen
      </button>
      <p className="text-[11px] text-muted text-center leading-relaxed">
        Schriftart, Größe & Bogen-Text in der Toolbar oben
      </p>
    </div>
  );
}
