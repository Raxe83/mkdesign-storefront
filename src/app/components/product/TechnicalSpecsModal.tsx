"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronRight } from "lucide-react";
import type { SpecRow } from "@/app/utils/parseProductDescription";

interface Props {
  specs: SpecRow[];
}

export function TechnicalSpecsModal({ specs }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (specs.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-12 pt-10 border-t border-zinc-200/60 dark:border-zinc-800 w-full flex items-center justify-between group"
      >
        <p className="text-xs uppercase tracking-widest text-muted dark:text-neutral-400 group-hover:text-primary dark:group-hover:text-neutral-100 transition-colors">
          Technische Details
        </p>
        <ChevronRight
          size={14}
          className="text-muted dark:text-neutral-500 group-hover:text-primary dark:group-hover:text-neutral-100 transition-colors"
        />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 flex items-end sm:items-center justify-center p-4"
            style={{ zIndex: 99999 }}
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Panel */}
            <div
              className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-950 rounded-t-2xl sm:rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200/60 dark:border-zinc-800">
                <p className="text-xs uppercase tracking-widest text-muted dark:text-neutral-400">
                  Technische Details
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full text-muted hover:text-primary dark:hover:text-neutral-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Schließen"
                >
                  <X size={16} />
                </button>
              </div>

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-zinc-200/60 dark:bg-zinc-800">
                {specs.map((spec, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 px-5 py-4 bg-white dark:bg-zinc-950"
                  >
                    <dt className="text-[10px] uppercase tracking-widest font-medium text-muted dark:text-neutral-500">
                      {spec.label}
                    </dt>
                    <dd className="text-sm font-medium text-primary dark:text-neutral-100">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
