"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  KeyboardEvent,
  type ReactNode,
} from "react";
import {
  Search,
  X,
  Package,
  FileText,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useHeaderSearch, SearchResult } from "../hooks/useHeaderSearch";
import { cn } from "../utils/utils";

interface HeaderSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Highlight matching text in bold ─────────────────────────────────────────

function HighlightText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const qLower = q.toLowerCase();
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const idx = remaining.toLowerCase().indexOf(qLower);
    if (idx === -1) {
      nodes.push(remaining);
      break;
    }
    if (idx > 0) nodes.push(remaining.slice(0, idx));
    nodes.push(
      <strong key={key++} className="font-semibold text-charcoal dark:text-neutral-100">
        {remaining.slice(idx, idx + q.length)}
      </strong>
    );
    remaining = remaining.slice(idx + q.length);
  }

  return <>{nodes}</>;
}

// ─── Result icon ──────────────────────────────────────────────────────────────

function ResultIcon({ result }: { result: SearchResult }) {
  if (result.type === "product") return <Package size={16} className="shrink-0 text-accent" />;
  if (result.href.startsWith("mailto:")) return <Mail size={16} className="shrink-0 text-muted" />;
  if (result.href.startsWith("tel:")) return <Phone size={16} className="shrink-0 text-muted" />;
  if (result.title === "Adresse") return <MapPin size={16} className="shrink-0 text-muted" />;
  return <FileText size={16} className="shrink-0 text-muted" />;
}

// ─── Result row ───────────────────────────────────────────────────────────────

function ResultRow({
  result,
  active,
  query,
  onClose,
}: {
  result: SearchResult;
  active: boolean;
  query: string;
  onClose: () => void;
}) {
  const isExternal = result.href.startsWith("mailto:") || result.href.startsWith("tel:");
  const Tag = isExternal ? "a" : Link;
  const linkProps = isExternal
    ? { href: result.href }
    : { href: result.href, onClick: onClose };

  return (
    <Tag
      {...linkProps}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 group border-l-[3px]",
        active
          ? "border-accent bg-accent/10 dark:bg-accent/15"
          : "border-transparent hover:bg-sand/40 dark:hover:bg-zinc-800/60"
      )}
    >
      {result.type === "product" && result.imageUrl ? (
        <div className="relative w-9 h-9 rounded-sm overflow-hidden shrink-0 bg-cream dark:bg-zinc-800">
          <Image src={result.imageUrl} alt={result.title} fill className="object-cover" sizes="36px" />
        </div>
      ) : (
        <span className="w-9 h-9 flex items-center justify-center shrink-0">
          <ResultIcon result={result} />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", active ? "text-accent" : "text-primary")}>
          <HighlightText text={result.title} query={query} />
        </p>
        {result.subtitle && (
          <p className="text-xs text-muted truncate mt-0.5">
            <HighlightText text={result.subtitle} query={query} />
          </p>
        )}
        {result.matchSnippet && (
          <p className="text-xs text-muted/80 truncate mt-0.5 italic">
            <HighlightText text={result.matchSnippet} query={query} />
          </p>
        )}
      </div>

      <ArrowUpRight
        size={14}
        className={cn(
          "shrink-0 transition-opacity duration-150",
          active ? "opacity-100 text-accent" : "opacity-0 text-muted group-hover:opacity-60"
        )}
      />
    </Tag>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const HeaderSearch = ({ isOpen, onClose }: HeaderSearchProps) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { results, productsLoaded } = useHeaderSearch(query);
  const allResults = [...results.products, ...results.info];

  // Focus input when opened, reset on close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, allResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        const target = allResults[activeIndex];
        if (target) {
          if (!target.href.startsWith("mailto:") && !target.href.startsWith("tel:")) {
            router.push(target.href);
          } else {
            window.location.href = target.href;
          }
          onClose();
        }
      }
    },
    [allResults, activeIndex, router, onClose]
  );

  if (!isOpen) return null;

  const hasResults = allResults.length > 0;
  const showHint = !query.trim();

  return (
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="absolute top-[72px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl">
        <div className="bg-cream dark:bg-zinc-900 rounded border border-border shadow-md flex flex-col">
          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
              onKeyDown={handleKeyDown}
              placeholder="Suche nach Produkten, Versand, Kontakt …"
              className="flex-1 bg-transparent text-sm text-primary placeholder:text-muted outline-none font-body"
              aria-label="Suche"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setActiveIndex(-1); inputRef.current?.focus(); }}
                className="p-1 text-muted hover:text-primary transition-colors duration-150"
                aria-label="Suche leeren"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[55vh] overflow-y-auto overscroll-contain py-2 scrollbar-thin scroll-smooth">
            {showHint ? (
              <p className="px-4 py-3 text-xs text-muted">
                Suche nach Produkten, Seiten oder Kontaktinformationen…
              </p>
            ) : !hasResults ? (
              <p className="px-4 py-3 text-xs text-muted">
                {productsLoaded
                  ? `Keine Ergebnisse für „${query}"`
                  : "Produkte werden geladen…"}
              </p>
            ) : (
              <>
                {results.products.length > 0 && (
                  <section>
                    <p className="px-4 pt-2 pb-1 text-[10px] font-medium text-muted uppercase tracking-widest">
                      Produkte <span className="normal-case tracking-normal">({results.products.length})</span>
                    </p>
                    {results.products.map((r, i) => (
                      <ResultRow
                        key={r.href}
                        result={r}
                        active={i === activeIndex}
                        query={query}
                        onClose={onClose}
                      />
                    ))}
                  </section>
                )}
                {results.info.length > 0 && (
                  <section className={results.products.length > 0 ? "mt-1" : ""}>
                    <p className="px-4 pt-2 pb-1 text-[10px] font-medium text-muted uppercase tracking-widest">
                      Informationen
                    </p>
                    {results.info.map((r, i) => (
                      <ResultRow
                        key={r.href}
                        result={r}
                        active={results.products.length + i === activeIndex}
                        query={query}
                        onClose={onClose}
                      />
                    ))}
                  </section>
                )}
              </>
            )}
          </div>

          {/* Footer hint */}
          {hasResults && (
            <div className="px-4 py-2 border-t border-border flex items-center gap-3 text-[10px] text-muted">
              <span><kbd className="px-1 py-0.5 bg-sand/60 dark:bg-zinc-800 rounded text-[9px]">↑↓</kbd> navigieren</span>
              <span><kbd className="px-1 py-0.5 bg-sand/60 dark:bg-zinc-800 rounded text-[9px]">↵</kbd> öffnen</span>
              <span><kbd className="px-1 py-0.5 bg-sand/60 dark:bg-zinc-800 rounded text-[9px]">Esc</kbd> schließen</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderSearch;
