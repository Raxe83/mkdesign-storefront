import { Suspense } from "react";
import { redirect } from "next/navigation";
import DesignStudioClient from "./DesignStudioClient";

export default async function DesignStudioPage() {
  // Phase 1: Design-Editor deaktivieren bis 3D-Studio ready ist
  if (process.env.NEXT_PUBLIC_ENABLE_EDITOR === "false") {
    redirect("/");
  }

  return (
    <Suspense>
      <DesignStudioClient />
    </Suspense>
  );
}
