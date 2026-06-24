import { Suspense } from "react";
import DesignStudioClient from "./DesignStudioClient";

export default function DesignStudioPage() {
  return (
    <Suspense>
      <DesignStudioClient />
    </Suspense>
  );
}
