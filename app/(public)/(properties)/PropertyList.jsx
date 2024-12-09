"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { MapPinIcon } from "@heroicons/react/24/solid";
import PropertyCard from "./PropertyCard";
import ButtonIcon from "@/app/components/ButtonIcon";

export default function PropertyList() {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const searchParams = useSearchParams();

  // Convert searchParams to a plain object
  const queryParams = useMemo(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        const data = await response.json();

        if (response.ok) {
          setAllProperties(data);
        } else {
          console.error("Error fetching properties:", data.error);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Apply filters using queryParams
  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    if (queryParams.propertyType) {
      filtered = filtered.filter(
        (property) =>
          property.propertyType.toLowerCase() ===
          queryParams.propertyType.toLowerCase()
      );
    }

    if (queryParams.location) {
      filtered = filtered.filter((property) =>
        property.location
          .toLowerCase()
          .includes(queryParams.location.toLowerCase())
      );
    }

    if (queryParams.bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms >= parseInt(queryParams.bedrooms, 10)
      );
    }

    if (queryParams.view) {
      const selectedView = queryParams.view.trim().toLowerCase(); // Single selected view
      console.log("selectedView", selectedView);
      filtered = filtered.filter((property) =>
        (property.views || []).some((propertyView) =>
          propertyView.toLowerCase().includes(selectedView)
        )
      );
    }

    if (queryParams.features) {
      const features = queryParams.features.split(",").map((f) => f.trim());
      filtered = filtered.filter((property) =>
        features.every((feature) =>
          (property.highlights || []).some((highlight) =>
            highlight.toLowerCase().includes(feature.toLowerCase())
          )
        )
      );
    }

    return filtered;
  }, [queryParams, allProperties]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProperties.slice(startIndex, endIndex);
  }, [currentPage, filteredProperties]);

  // Handlers for pagination buttons
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return <p>Loading properties...</p>;
  }

  if (filteredProperties.length === 0) {
    return <p className="text-center col-span-full">No properties found.</p>;
  }

  return (
    <>
      {/* Map Button */}
      <div className="flex justify-end px-6">
        <ButtonIcon icon={MapPinIcon} href={"/map"} />
      </div>

      {/* Property Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            companyName={property.companyName}
            siteUrl={property.siteUrl}
            mainImageUrl={property.mainImageUrl}
            location={property.location}
            address={property.address}
            title={property.title}
            score={property.score}
            propertyType={property.propertyType}
            bathrooms={property.bathrooms}
            kitchens={property.kitchens}
            bedrooms={property.bedrooms}
            highlights={property.highlights}
            views={property.views}
            isFavoriteInitial={false}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {currentProperties.length > 0 && (
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
      )}
    </>
  );
}
