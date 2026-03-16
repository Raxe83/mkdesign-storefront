import { cn } from "@/app/utils/utils";

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

const SkeletonCard = () => (
  <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
    <div className="px-4 pb-4 flex justify-between items-center gap-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-9 flex-1" />
    </div>
  </div>
);

Skeleton.Card = SkeletonCard;

export default Skeleton;
