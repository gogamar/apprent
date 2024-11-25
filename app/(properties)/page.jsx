import { Suspense } from "react";

import PropertyList from "./PropertyList";
import Loading from "../loading";

export default function Properties() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <PropertyList />
      </Suspense>
    </main>
  );
}
