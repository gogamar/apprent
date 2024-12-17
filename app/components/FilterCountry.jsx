"use client";

import PropTypes from "prop-types";

import { useState } from "react";
import Select from "react-select";

export default function FilterCountry({
  countries,
  selectedCountry,
  onCountryChange,
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full max-w-sm">
      <Select
        instanceId="select-country"
        options={countries}
        isLoading={isLoading}
        value={
          countries.find((option) => option.value === selectedCountry) || null
        }
        onChange={(selectedOption) =>
          onCountryChange(selectedOption?.value || null)
        }
        placeholder="Select a country..."
        isClearable
        classNamePrefix="react-select"
      />
    </div>
  );
}

FilterCountry.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCountry: PropTypes.string,
  onCountryChange: PropTypes.func.isRequired,
};
