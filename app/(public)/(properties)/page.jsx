"use client";

import { useSearchParams } from "next/navigation";

import PropertyList from "@/app/components/PropertyList";

export default function Properties() {
  const searchParams = useSearchParams();

  // Convert searchParams to a plain object
  const params = Object.fromEntries(searchParams.entries());

  return (
    <main>
      <PropertyList searchParams={params} />
    </main>
  );
}
