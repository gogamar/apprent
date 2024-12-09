"use client";

import Navbar from "@/app/components/Navbar";
import Filters from "@/app/components/Filters";
import { usePathname } from "next/navigation";

export default function PublicLayout({ children }) {
  const pathname = usePathname();
  const showFilters = pathname === "/";
  return (
    <>
      <Navbar />
      <div className="mx-auto flex w-full max-w-8xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
        {showFilters && (
          <aside className="sticky top-8 hidden w-72 shrink-0 lg:block">
            <Filters />
          </aside>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
