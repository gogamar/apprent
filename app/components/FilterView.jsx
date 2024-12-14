"use client";

import PropTypes from "prop-types";

import { useEffect, useState } from "react";
import Select from "react-select";

export default function FilterView({ selectedView, onSelect }) {
  const [views, setViews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchViews = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/filter");
        const data = await response.json();
        const formattedViews = data.views.map((view) => ({
          value: view,
          label: view,
        }));
        setViews(formattedViews);
      } catch (error) {
        console.error("Error fetching filter:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViews();
  }, []);

  return (
    <div className="w-full max-w-sm lg:sm:text-sm">
      <Select
        instanceId="select-view"
        options={views}
        isLoading={isLoading}
        value={views.find((option) => option.value === selectedView) || null}
        onChange={(selectedOption) => onSelect(selectedOption?.value || null)}
        placeholder="Select a view"
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
}

FilterView.propTypes = {
  selectedView: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
