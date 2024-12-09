"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

export default function FilterView({ selectedView, onSelect }) {
  const [views, setViews] = useState([]);

  useEffect(() => {
    const fetchViews = async () => {
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
      }
    };

    fetchViews();
  }, []);

  return (
    <div className="w-full max-w-sm">
      <Select
        instanceId="select-view"
        options={views}
        value={views.find((option) => option.value === selectedView) || null}
        onChange={(selectedOption) => onSelect(selectedOption?.value || null)}
        placeholder="Select a view"
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
}
