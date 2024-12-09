"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import PropertyList from "./PropertyList";
import Loading from "@/app/loading";

export default function Properties() {
  const searchParams = useSearchParams(); // Hook to get search parameters from the URL

  // Convert searchParams to a plain object
  const params = Object.fromEntries(searchParams.entries());

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <PropertyList searchParams={params} />
      </Suspense>
    </main>
  );
}
