"use client";

import { useState, useMemo } from "react";

import { useAuthContext } from "@/app/context/AuthContext";
import {
  paginateItems,
  calculatePaginationRange,
} from "@/app/utils/pagination";

import PrivateActions from "./PrivateActions";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";

export default function PropertyIndex({ properties, onToggleField, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalResults = properties.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const { user, role, loading } = useAuthContext();

  const currentProperties = useMemo(
    () => paginateItems(properties, currentPage, itemsPerPage),
    [currentPage, properties]
  );

  const { fromProperty, toProperty } = calculatePaginationRange(
    currentPage,
    itemsPerPage,
    totalResults
  );

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">
            {user && role === "admin"
              ? `Hello ${user?.displayName}! Here are all the properties in Vista Selection.`
              : `Hello ${user?.displayName}! Here are the properties you added to Vista Selection.`}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {user && role === "admin"
              ? "As an admin, you can edit all properties, mark them as featured or published, or remove them. You can also add an iCal link to update the property's availability."
              : "You can add new properties, edit existing ones, or delete them. By clicking the Calendar button, you can add an external iCal link to update the property's availability. Additionally, you can block dates directly."}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/account/properties/new"
            className="block rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Add property
          </a>
        </div>
      </div>

      {/* Property Cards */}
      <div className="mt-8 space-y-6">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            actions={
              <PrivateActions
                property={property}
                onToggleField={onToggleField}
                onDelete={onDelete}
              />
            }
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        fromProperty={fromProperty}
        toProperty={toProperty}
        totalResults={totalResults}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
