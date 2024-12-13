"use client";

import PropTypes from "prop-types";

export default function FilterBedrooms({ selectedBedrooms, onBedroomsChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">Number of Bedrooms:</p>
      {[1, 2, 3, 4].map((count) => (
        <label key={count} className="flex items-center gap-2">
          <input
            type="radio"
            name="bedrooms"
            value={count}
            checked={selectedBedrooms === count}
            onChange={() => onBedroomsChange(count)}
            className="h-4 w-4 text-teal-500 focus:ring-teal-500"
          />
          <span>{`${count} or more`}</span>
        </label>
      ))}
    </div>
  );
}

FilterBedrooms.propTypes = {
  selectedBedrooms: PropTypes.number.isRequired,
  onBedroomsChange: PropTypes.func.isRequired,
};
