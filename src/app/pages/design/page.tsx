import { Suspense } from "react";
import DesignEditor from "@/app/components/design/DesignEditor";
import { getExtraInfoByType, getFaqByType } from "@/app/services/shopify";
import { ProductExtraContent } from "@/app/components/product/ProductExtraContent";
import { ProductFaq } from "@/app/components/product/ProductFaq";

// ─── Streaming Sektionen ──────────────────────────────────────────────────────

async function ExtraInfoSection() {
  const metaobjects = await getExtraInfoByType("feuertonnen");
  if (metaobjects.length === 0) return null;
  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800">
      <ProductExtraContent metaobjects={metaobjects} />
    </div>
  );
}

function ExtraInfoSkeleton() {
  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800 animate-pulse">
      <div className="rounded overflow-hidden border border-stone-200/50 dark:border-zinc-700/50">
        <div className="h-48 bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

async function FaqSection() {
  const metaobjects = await getFaqByType("feuertonnen");
  if (metaobjects.length === 0) return null;
  return <ProductFaq metaobjects={metaobjects} />;
}

function FaqSkeleton() {
  return (
    <div className="mt-16 pt-10 border-t border-zinc-200/60 dark:border-zinc-800 animate-pulse">
      {[0, 1, 2].map((i) => (
        <div key={i} className="py-4">
          <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: `${55 + i * 10}%` }} />
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignPage() {
  return (
    <div>
      <Suspense>
        <DesignEditor />
      </Suspense>

      <Suspense fallback={<ExtraInfoSkeleton />}>
        <ExtraInfoSection />
      </Suspense>

      <Suspense fallback={<FaqSkeleton />}>
        <FaqSection />
      </Suspense>
    </div>
  );
}
