import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import DesignViewer from "@/app/components/design/DesignViewer";

export default function DesignViewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh] gap-2 text-muted text-sm">
          <Loader2 size={18} className="animate-spin" />
          Design wird vorbereitet…
        </div>
      }
    >
      <DesignViewer />
    </Suspense>
  );
}
