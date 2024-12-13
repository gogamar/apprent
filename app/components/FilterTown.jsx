"use client";

import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import Select from "react-select";

export default function FilterTown({ selectedTown, onTownChange }) {
  const [towns, setTowns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTowns = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/filter");
        const data = await response.json();
        const options = data.towns.map((town) => ({
          value: town,
          label: town,
        }));
        setTowns(options);
      } catch (error) {
        console.error("Error fetching towns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTowns();
  }, []);

  return (
    <div className="w-full max-w-sm">
      <Select
        instanceId="select-town"
        options={towns}
        isLoading={isLoading}
        value={towns.find((option) => option.value === selectedTown) || null}
        onChange={(selectedOption) =>
          onTownChange(selectedOption?.value || null)
        }
        placeholder="Select a location..."
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
}

FilterTown.propTypes = {
  selectedTown: PropTypes.string,
  onTownChange: PropTypes.func.isRequired,
};
