import { Suspense } from "react";
import MenuEditorInner from "./MenuEditorInner";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Caricamento…</div>}>
      <MenuEditorInner />
    </Suspense>
  );
}
