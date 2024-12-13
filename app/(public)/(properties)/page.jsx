"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import {
  paginateItems,
  calculatePaginationRange,
} from "@/app/utils/pagination";

import LoadingList from "@/app/components/LoadingList";
import PropertyList from "@/app/components/PropertyList";

export default function Properties() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams]
  );

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/properties");
        const data = await response.json();

        if (response.ok) {
          setProperties(data);
        } else {
          setError(data.error || "Failed to fetch properties");
        }
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching properties"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const filterProperties = () => {
      let filtered = properties;

      if (params.propertyType) {
        filtered = filtered.filter(
          (property) =>
            property.propertyType?.toLowerCase() ===
            params.propertyType.toLowerCase()
        );
      }

      if (params.town) {
        filtered = filtered.filter((property) =>
          property.town?.toLowerCase().includes(params.town.toLowerCase())
        );
      }

      if (params.bedrooms) {
        filtered = filtered.filter(
          (property) => property.bedrooms >= parseInt(params.bedrooms, 10)
        );
      }

      if (params.view) {
        const selectedView = params.view.trim().toLowerCase();
        filtered = filtered.filter((property) =>
          (property.views || []).some((propertyView) =>
            propertyView.toLowerCase().includes(selectedView)
          )
        );
      }

      if (params.features) {
        const features = params.features.split(",").map((f) => f.trim());
        filtered = filtered.filter((property) =>
          features.every((feature) =>
            (property.highlights || []).some((highlight) =>
              highlight.toLowerCase().includes(feature.toLowerCase())
            )
          )
        );
      }

      return filtered;
    };

    const filtered = filterProperties();
    setFilteredProperties(filtered);
    setCurrentPage(1);
  }, [params, properties]);

  const totalResults = filteredProperties.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const currentProperties = useMemo(
    () => paginateItems(filteredProperties, currentPage, itemsPerPage),
    [currentPage, filteredProperties]
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

  if (loading) {
    return <LoadingList itemsPerPage={itemsPerPage} />;
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">Error: {error}</div>;
  }

  return (
    <PropertyList
      properties={currentProperties}
      pagination={{
        fromProperty,
        toProperty,
        totalResults,
        currentPage,
        totalPages,
        onNext: handleNext,
        onPrevious: handlePrevious,
      }}
    />
  );
}
