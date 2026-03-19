"use client";

import { ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/app/utils/utils";

type Props = {
  imageUploading: boolean;
  onClickUpload:  () => void;
};

export function ImagePanel({ imageUploading, onClickUpload }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onClickUpload}
        disabled={imageUploading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2.5 rounded",
          "border border-stone-200/80 dark:border-zinc-700",
          "text-sm font-medium text-stone dark:text-muted",
          "hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 hover:text-rust",
          "transition-all duration-200 cursor-pointer active:scale-[0.98]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        )}
      >
        {imageUploading
          ? <><Loader2 size={15} className="animate-spin" /> Wird hochgeladen…</>
          : <><ImagePlus size={15} /> Bild hochladen</>}
      </button>
      <p className="text-[11px] text-muted text-center">PNG, JPG, SVG — wird auf den Canvas platziert</p>
    </div>
  );
}
