"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

export default function FilterLocation({ selectedLocation, onLocationChange }) {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/filter");
        const data = await response.json();
        const options = data.locations.map((location) => ({
          value: location,
          label: location,
        }));
        setLocations(options);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="w-full max-w-sm">
      <Select
        instanceId="select-location"
        options={locations}
        isLoading={isLoading}
        value={
          locations.find((option) => option.value === selectedLocation) || null
        }
        onChange={(selectedOption) =>
          onLocationChange(selectedOption?.value || null)
        }
        placeholder="Select a location..."
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
}
