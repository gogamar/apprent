"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FilterView from "./FilterView";
import FilterLocation from "./FilterLocation";
import FilterBedrooms from "./FilterBedrooms";
import FilterFeatures from "./FilterFeatures";

function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for each filter
  const [bedrooms, setBedrooms] = useState(null);
  const [features, setFeatures] = useState([]);

  const updateQueryParams = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (Array.isArray(value)) {
      const filteredValue = value.filter((item) => item.trim() !== "");
      if (filteredValue.length > 0) {
        params.set(key, filteredValue.join(","));
      } else {
        params.delete(key);
      }
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/?${params.toString()}`);
  };

  // Sync state with query parameters on initial load
  useEffect(() => {
    const bedroomsFromParams = searchParams.get("bedrooms");
    const featuresFromParams = searchParams.get("features")?.split(",") || [];

    if (bedroomsFromParams) setBedrooms(Number(bedroomsFromParams));
    if (featuresFromParams) setFeatures(featuresFromParams);
  }, [searchParams]);

  return (
    <div className="flex flex-col gap-6 bg-white p-4 rounded-md shadow">
      {/* View Filter */}
      <FilterView
        selectedView={searchParams.get("view") || ""}
        onSelect={(view) => updateQueryParams("view", view)}
      />

      {/* Location Filter */}
      <FilterLocation
        selectedLocation={searchParams.get("location") || ""}
        onLocationChange={(location) => updateQueryParams("location", location)}
      />

      {/* Bedrooms Filter */}
      <FilterBedrooms
        selectedBedrooms={bedrooms}
        onBedroomsChange={(value) => {
          setBedrooms(value); // Update state
          updateQueryParams("bedrooms", value); // Update URL
        }}
      />

      {/* Features Filter */}
      <FilterFeatures
        selectedFeatures={features}
        onFeaturesChange={(updatedFeatures) => {
          setFeatures(updatedFeatures);
          updateQueryParams("features", updatedFeatures);
        }}
      />
    </div>
  );
}

export default Filters;
