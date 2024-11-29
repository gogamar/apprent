"use client";

import { useState, useMemo } from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyListClient({ allProperties }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Calculate total pages
  const totalPages = Math.ceil(allProperties.length / itemsPerPage);

  // Get current page properties
  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allProperties.slice(startIndex, endIndex);
  }, [currentPage, allProperties]);

  // Handlers for pagination buttons
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            companyName={property.companyName}
            baseUrl={property.baseUrl || property.websiteUrl}
            imageUrl={property.mainImageUrl || property.imageUrls[0]}
            location={property.location}
            title={property.title}
            details={property.details}
            score={property.score}
            propertyType={property.propertyType}
            numberOfBathrooms={property.numberOfBathrooms}
            numberOfKitchens={property.numberOfKitchens}
            numberOfRooms={property.numberOfRooms}
            isFavoriteInitial={false}
          />
        ))}
        {currentProperties.length === 0 && (
          <p className="text-center col-span-full">No properties found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex mt-16 justify-center items-center gap-4">
        {/* "Previous" Button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          Previous
        </button>

        {/* Page Indicators */}
        <span>
          Page {currentPage} of {totalPages}
        </span>

        {/* "Next" Button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-teal-500 text-white hover:bg-teal-600"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
}
