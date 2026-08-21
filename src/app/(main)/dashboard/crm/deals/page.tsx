import { Suspense } from "react";

import { Deals } from "./_components/deals";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Deals />
    </Suspense>
  );
}
