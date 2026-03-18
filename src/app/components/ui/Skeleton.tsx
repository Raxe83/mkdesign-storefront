import { cn } from "@/app/utils/utils";
import ComponentLayout from "@/app/components/ComponentLayout";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = ({ className, ...props }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded bg-zinc-200 dark:bg-zinc-800",
      className
    )}
    {...props}
  />
);

// ─── Product card skeleton (matches ProductCard aspect-[4/5]) ─────────────────

const SkeletonCard = () => (
  <div className="flex flex-col gap-3">
    <Skeleton className="aspect-[4/5] w-full rounded" />
    <div className="space-y-2">
      <div className="flex justify-between gap-4">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3.5 w-12" />
      </div>
    </div>
  </div>
);

// ─── Section header skeleton (label + title) ──────────────────────────────────

const SkeletonSectionHeader = () => (
  <div className="max-w-lg mb-10 space-y-3">
    <Skeleton className="h-3 w-24" />
    <Skeleton className="h-8 w-72" />
    <Skeleton className="h-4 w-96 max-w-full" />
  </div>
);

// ─── Collections grid skeleton (matches CategoryGrid) ────────────────────────

const SkeletonCollectionsGrid = () => (
  <ComponentLayout className="py-8 sm:py-12 lg:py-16">
    <SkeletonSectionHeader />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[240px] gap-3">
      {/* Row 1: 2 wide cards */}
      <Skeleton className="col-span-1 sm:col-span-2 rounded-sm" />
      <Skeleton className="col-span-1 sm:col-span-2 rounded-sm" />
      {/* Row 2: 4 normal cards */}
      <Skeleton className="rounded-sm" />
      <Skeleton className="rounded-sm" />
      <Skeleton className="rounded-sm" />
      <Skeleton className="rounded-sm" />
    </div>
  </ComponentLayout>
);

// ─── Products list skeleton (matches ProductsList) ────────────────────────────

const SkeletonProductsGrid = () => (
  <ComponentLayout className="py-8 sm:py-12 lg:py-16">
    {/* Header row */}
    <div className="flex items-end justify-between mb-8 sm:mb-10">
      <div className="max-w-lg space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-56" />
      </div>
      <Skeleton className="hidden sm:block h-4 w-24" />
    </div>
    {/* Desktop grid */}
    <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
    {/* Mobile scroll */}
    <div className="md:hidden flex gap-4 overflow-hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-[72vw] max-w-[280px]">
          <SkeletonCard />
        </div>
      ))}
    </div>
  </ComponentLayout>
);

// ─── Category card skeleton (matches CategoryCard aspect-[3/4]) ───────────────

const SkeletonCategoryCard = () => (
  <div className="aspect-[3/4] w-full rounded animate-pulse bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);

Skeleton.Card = SkeletonCard;
Skeleton.CategoryCard = SkeletonCategoryCard;
Skeleton.CollectionsGrid = SkeletonCollectionsGrid;
Skeleton.ProductsGrid = SkeletonProductsGrid;

export default Skeleton;
