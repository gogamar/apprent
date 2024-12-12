"use client";

import { useState, useMemo } from "react";

import PrivateActions from "./PrivateActions";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";

export default function PropertyIndex({ properties, onToggleField, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalResults = properties.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Get current properties for the current page
  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return properties.slice(startIndex, endIndex);
  }, [currentPage, properties]);

  // Calculate fromProperty and toProperty for pagination display
  const fromProperty = (currentPage - 1) * itemsPerPage + 1;
  const toProperty = Math.min(currentPage * itemsPerPage, totalResults);

  // Handlers for pagination buttons
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the properties and their details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/account/properties/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
