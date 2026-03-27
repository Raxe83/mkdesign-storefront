import Skeleton from "../../components/ui/Skeleton";

// PageHeader-Skeleton (passend zu -mt-16 bg-charcoal Layout)
function PageHeaderSkeleton() {
  return (
    <div className="w-screen ml-[calc(50%-50vw)] -mt-16 mb-10 bg-charcoal">
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16 pt-14 pb-8 lg:pt-16 lg:pb-10">
        {/* Breadcrumb */}
        <Skeleton className="h-3 w-40 mb-6 bg-zinc-700" />
        {/* Eyebrow + Title */}
        <Skeleton className="h-3 w-20 mb-3 bg-zinc-700" />
        <Skeleton className="h-9 w-56 mb-3 bg-zinc-700" />
        <Skeleton className="h-4 w-32 mb-8 bg-zinc-700" />
        {/* Filter-Bar */}
        <Skeleton className="h-10 w-36 rounded-lg bg-zinc-700" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="pb-12">
      <PageHeaderSkeleton />
      <div className="max-w-screen-xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
