"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPinIcon } from "@heroicons/react/24/solid";

import LoadingList from "@/app/components/LoadingList";
import PropertyCard from "@/app/components/PropertyCard";
import BookButton from "@/app/components/BookButton";
import ButtonIcon from "@/app/components/ButtonIcon";
import Pagination from "@/app/components/Pagination";
import AlertLink from "@/app/components/AlertLink";

export default function PropertyList({
  properties: allProperties,
  loading,
  searchParams: queryParams,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProperties = useMemo(() => {
    let filtered = allProperties;

    if (queryParams.propertyType) {
      filtered = filtered.filter(
        (property) =>
          property.propertyType?.toLowerCase() ===
          queryParams.propertyType.toLowerCase()
      );
    }

    if (queryParams.town) {
      filtered = filtered.filter((property) =>
        property.town?.toLowerCase().includes(queryParams.town.toLowerCase())
      );
    }

    if (queryParams.bedrooms) {
      filtered = filtered.filter(
        (property) => property.bedrooms >= parseInt(queryParams.bedrooms, 10)
      );
    }

    if (queryParams.view) {
      const selectedView = queryParams.view.trim().toLowerCase();
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

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [queryParams]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const totalResults = filteredProperties.length;

  const currentProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProperties.slice(startIndex, endIndex);
  }, [currentPage, filteredProperties]);

  // Recalculate fromProperty and toProperty based on filtered results
  const fromProperty =
    totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const toProperty = Math.min(currentPage * itemsPerPage, totalResults);

  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return <LoadingList itemsPerPage={itemsPerPage} />;
  }

  if (filteredProperties.length === 0) {
    const alertText = "No properties found with the selected filters.";
    const alertUrl = "/";
    const actionText = "Remove filters";
    return (
      <AlertLink
        alertText={alertText}
        actionUrl={alertUrl}
        actionText={actionText}
      />
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
