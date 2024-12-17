"use client";

import PropTypes from "prop-types";

import { useState } from "react";
import Select from "react-select";

export default function FilterView({ views, selectedView, onSelect }) {
  const [isLoading, setIsLoading] = useState(false);

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
  views: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedView: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};
