"use client";

import { Download, ImagePlus, Loader2, Trash2, Type } from "lucide-react";
import { cn } from "@/app/utils/utils";

type Props = {
  imageUploading: boolean;
  hasSelection: boolean;
  onAddText: () => void;
  onUploadImage: () => void;
  onDelete: () => void;
  onDownload: () => void;
};

export function MobileToolbar({
  imageUploading,
  hasSelection,
  onAddText,
  onUploadImage,
  onDelete,
  onDownload,
}: Props) {
  const tools = [
    { icon: <Type size={16} />, label: "Text", action: onAddText },
    {
      icon: imageUploading
        ? <Loader2 size={16} className="animate-spin" />
        : <ImagePlus size={16} />,
      label: "Bild",
      action: onUploadImage,
    },
    {
      icon: <Trash2 size={16} />,
      label: "Löschen",
      action: onDelete,
      destructive: true,
      disabled: !hasSelection,
    },
    { icon: <Download size={16} />, label: "Download", action: onDownload },
  ];

  return (
    <div className="flex gap-2 pb-1 -mx-1 px-1">
      {tools.map((t) => (
        <button
          key={t.label}
          onClick={t.action}
          disabled={"disabled" in t ? t.disabled : false}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1",
            "rounded border border-stone-200/80 dark:border-zinc-700/80",
            "bg-surface dark:bg-zinc-900",
            "px-3 py-2.5",
            "text-[10px] font-medium",
            "transition-all duration-200 cursor-pointer active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "destructive" in t && t.destructive
              ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              : "text-stone dark:text-muted hover:border-rust/40 hover:bg-rustLight dark:hover:bg-zinc-800 hover:text-rust",
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
