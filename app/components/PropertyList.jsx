"use client";

import PropTypes from "prop-types";

import PropertyCard from "./PropertyCard";
import BookButton from "./BookButton";
import ButtonIcon from "./ButtonIcon";
import Pagination from "./Pagination";
import AlertLink from "./AlertLink";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function PropertyList({ properties, pagination }) {
  const {
    fromProperty,
    toProperty,
    totalResults,
    onNext,
    onPrevious,
    currentPage,
    totalPages,
  } = pagination;

  if (properties.length === 0) {
    const alertText = "No properties found with the selected filters.";
    const alertUrl = "/";
    const actionText = "Remove filters";
    return (
      <div className="flex justify-center lg:mt-24">
        <AlertLink
          alertText={alertText}
          actionUrl={alertUrl}
          actionText={actionText}
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end px-6">
        <ButtonIcon icon={MapPinIcon} href={"/map"} />
      </div>

      <div className="grid grid-cols-1 gap-6 py-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            actions={
              <BookButton
                companyName={property.companyName}
                href={property.siteUrl}
              />
            }
          />
        ))}
      </div>

      <Pagination
        fromProperty={fromProperty}
        toProperty={toProperty}
        totalResults={totalResults}
        onNext={onNext}
        onPrevious={onPrevious}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </>
  );
}

PropertyList.propTypes = {
  properties: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    fromProperty: PropTypes.number.isRequired,
    toProperty: PropTypes.number.isRequired,
    totalResults: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
  }).isRequired,
};
