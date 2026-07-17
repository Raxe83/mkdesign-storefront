import { Suspense } from "react";
import { redirect } from "next/navigation";
import DesignEditor from "@/app/components/design/DesignEditor";
import { getFaqByType } from "@/app/services/shopify";
import { ProductFaq } from "@/app/components/product/ProductFaq";

// ── FAQ bleibt statisch für "feuertonnen" (häufigste Design-Kategorie) ──────

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

export default async function DesignPage() {
  // Phase 1: Design-Editor deaktivieren bis 3D-Studio ready ist
  if (process.env.NEXT_PUBLIC_ENABLE_EDITOR === "false") {
    redirect("/");
  }

  return (
    <div>
      <Suspense>
        <DesignEditor />
      </Suspense>

      <Suspense fallback={<FaqSkeleton />}>
        <FaqSection />
      </Suspense>
    </div>
  );
}
