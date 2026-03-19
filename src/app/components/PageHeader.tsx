"use client";

import Link from "next/link";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  eyebrow: string;
  breadcrumbs: PageHeaderBreadcrumb[];
  count?: number;
  totalCount?: number;
  singularLabel?: string;
  pluralLabel?: string;
  isLoading?: boolean;
  /** Slot for search / filter bar rendered below the title */
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  eyebrow,
  breadcrumbs,
  count,
  totalCount,
  singularLabel = "Eintrag",
  pluralLabel = "Einträge",
  isLoading = false,
  children,
}: PageHeaderProps) {
  const showCount = count !== undefined || isLoading;

  return (
    <div className="w-screen ml-[calc(50%-50vw)] -mt-16 mb-10 bg-charcoal relative">
      {/* Mood overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-rust/10 via-transparent to-charcoal pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pt-14 pb-8 lg:pt-16 lg:pb-10 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-6 text-[11px] font-medium uppercase tracking-[0.12em] text-white/35">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white/60 transition-colors duration-150">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/60">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title row */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-px bg-rust" />
              <span className="text-xs font-medium text-rust tracking-[0.15em] uppercase">
                {eyebrow}
              </span>
            </div>
            <h1 className="font-display font-bold leading-[1.05] tracking-tight text-[clamp(1.9rem,4vw,3.25rem)] text-white">
              {title}
            </h1>
            {showCount && (
              <p className="mt-3 text-sm text-white/45 flex items-center gap-1.5">
                {isLoading ? (
                  <span className="inline-block h-3.5 w-16 rounded bg-white/15 animate-pulse" />
                ) : (
                  <>
                    <span className="text-white/70 font-medium">{count}</span>
                    {totalCount !== undefined && count !== totalCount && (
                      <> von <span className="text-white/70 font-medium">{totalCount}</span></>
                    )}{" "}
                    {count === 1 ? singularLabel : pluralLabel}
                  </>
                )}
              </p>
            )}
          </div>

          {(isLoading || totalCount !== undefined) && (
            <div className="block shrink-0 text-right select-none">
              {isLoading ? (
                <>
                  <div className="h-14 lg:h-[4.5rem] w-24 lg:w-32 rounded bg-white/10 animate-pulse" />
                  <div className="h-2.5 w-20 rounded bg-white/10 animate-pulse mt-2 ml-auto" />
                </>
              ) : (
                <>
                  <p className="font-display font-bold text-[3.5rem] lg:text-[4.5rem] leading-none text-white/10 tabular-nums">
                    {totalCount}
                  </p>
                  <p className="text-[10px] text-white/20 uppercase tracking-[0.14em] font-medium mt-1">
                    {pluralLabel} gesamt
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Slot: search / filter */}
        {children && (
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            {children}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="h-px bg-gradient-to-r from-rust via-rust/25 to-transparent" />
    </div>
  );
}
