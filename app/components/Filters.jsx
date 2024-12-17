"use client";

import PropTypes from "prop-types";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import FilterView from "./FilterView";
import FilterCountry from "./FilterCountry";
import FilterBedrooms from "./FilterBedrooms";
import FilterFeatures from "./FilterFeatures";

export default function Filters({ views = [], countries = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <div className="flex flex-col gap-6 p-4 sm:text-sm lg:sticky lg:top-20 max-w-full">
      <FilterView
        views={views}
        selectedView={searchParams.get("view") || ""}
        onSelect={(view) => updateQueryParams("view", view)}
      />

      <FilterCountry
        countries={countries}
        selectedCountry={searchParams.get("country") || ""}
        onCountryChange={(country) => updateQueryParams("country", country)}
      />

      <FilterBedrooms
        selectedBedrooms={bedrooms}
        onBedroomsChange={(value) => {
          setBedrooms(value);
          updateQueryParams("bedrooms", value);
        }}
      />

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

Filters.propTypes = {
  views: PropTypes.arrayOf(PropTypes.object),
  countries: PropTypes.arrayOf(PropTypes.object),
};
