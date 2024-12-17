"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { MapPinIcon } from "@heroicons/react/24/outline";

import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";
import BookButton from "./BookButton";
import ButtonIcon from "./ButtonIcon";
import AlertLink from "./AlertLink";
import PropTypes from "prop-types";

export default function PropertyList({ initialProperties }) {
  const [filteredProperties, setFilteredProperties] =
    useState(initialProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();

  const itemsPerPage = 10;

  // Parse and memoize search parameters
  const parsedParams = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      view: params.view?.toLowerCase() || null,
      country: params.country?.toLowerCase() || null,
      bedrooms: params.bedrooms ? parseInt(params.bedrooms, 10) : null,
      features: params.features
        ? params.features.split(",").map((f) => f.trim().toLowerCase())
        : [],
    };
  }, [searchParams]);

  // Filter properties based on parsed search parameters
  useEffect(() => {
    const filterProperties = () => {
      return initialProperties.filter((property) => {
        // Filter by view
        if (
          parsedParams.view &&
          !(property.views || []).some(
            (view) => view.toLowerCase() === parsedParams.view
          )
        ) {
          return false;
        }

        // Filter by country
        if (
          parsedParams.country &&
          property.country?.toLowerCase() !== parsedParams.country
        ) {
          return false;
        }

        // Filter by bedrooms
        if (
          parsedParams.bedrooms &&
          property.bedrooms < parsedParams.bedrooms
        ) {
          return false;
        }

        // Filter by features
        if (parsedParams.features.length > 0) {
          const hasAllFeatures = parsedParams.features.every((feature) =>
            (property.highlights || []).some((highlight) =>
              highlight.toLowerCase().includes(feature)
            )
          );
          if (!hasAllFeatures) return false;
        }

        return true;
      });
    };

    setFilteredProperties(filterProperties());
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [parsedParams, initialProperties]);

  const totalResults = filteredProperties.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProperties]);

  const fromProperty = (currentPage - 1) * itemsPerPage + 1;
  const toProperty = Math.min(currentPage * itemsPerPage, totalResults);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (filteredProperties.length === 0) {
    const alertText = "No properties found with the selected filters.";
    const alertUrl = "/";
    const actionText = "Remove filters";
    return (
      <div className="flex justify-center lg:mt-24">
        <AlertLink
          alertText={alertText}
          actionUrl={alertUrl}
          actionText={actionText}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end px-6">
        <ButtonIcon icon={MapPinIcon} href={"/map"} />
      </div>

      <div className="grid grid-cols-1 gap-6 py-6">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            actions={
              <BookButton
                companyName={property.companyName}
                href={property.siteUrl}
              />
            }
          />
        ))}
      </div>

      <Pagination
        fromProperty={fromProperty}
        toProperty={toProperty}
        totalResults={totalResults}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}

PropertyList.propTypes = {
  initialProperties: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      views: PropTypes.arrayOf(PropTypes.string),
      country: PropTypes.string,
      bedrooms: PropTypes.number,
      highlights: PropTypes.arrayOf(PropTypes.string),
      companyName: PropTypes.string,
      siteUrl: PropTypes.string,
    })
  ).isRequired,
};
