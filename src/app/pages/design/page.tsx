import { Suspense } from "react";
import DesignEditor from "@/app/components/design/DesignEditor";

export default function DesignPage() {
  return (
    <Suspense>
      <DesignEditor />
    </Suspense>
  );
}
