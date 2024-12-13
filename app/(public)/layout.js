"use client";

import PropTypes from "prop-types";

import { usePathname } from "next/navigation";
import Filters from "@/app/components/Filters";

export default function PublicLayout({ children }) {
  const pathname = usePathname(); // Get the current route

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Show Filters only on the Home page */}
      {pathname === "/" && (
        <div className="bg-gray-100 border-b border-gray-200 p-4 lg:border-b-0 lg:border-r lg:w-1/4">
          <Filters />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
