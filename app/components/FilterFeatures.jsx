"use client";

import PropTypes from "prop-types";

export default function FilterFeatures({ selectedFeatures, onFeaturesChange }) {
  const features = ["Pool", "Air conditioning", "Wifi"];

  return (
    <div className="flex flex-col gap-2">
      <p className="sm:text-sm font-semibold">Features:</p>
      {features.map((feature) => (
        <label key={feature} className="flex items-center gap-2">
          <input
            type="checkbox"
            value={feature}
            checked={selectedFeatures.includes(feature)}
            onChange={() => {
              const updatedFeatures = selectedFeatures.includes(feature)
                ? selectedFeatures.filter((f) => f !== feature)
                : [...selectedFeatures, feature];
              onFeaturesChange(updatedFeatures);
            }}
            className="h-4 w-4 text-teal-500 focus:ring-teal-500"
          />
          <span>{feature}</span>
        </label>
      ))}
    </div>
  );
}

FilterFeatures.propTypes = {
  selectedFeatures: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFeaturesChange: PropTypes.func.isRequired,
};
