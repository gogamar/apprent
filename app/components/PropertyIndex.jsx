"use client";

import PropTypes from "prop-types";

import PrivateActions from "./PrivateActions";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";
export default function PropertyIndex({
  properties,
  fromProperty,
  toProperty,
  totalResults,
  currentPage,
  totalPages,
  onNext,
  onPrevious,
  onToggleField,
  onDelete,
  user,
  role,
}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">
            {user && role === "admin"
              ? `Hello ${user?.displayName}! Manage all the properties published on Vista Selection.`
              : `Hello ${user?.displayName}! Manage the properties you have published on Vista Selection.`}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {user && role === "admin"
              ? "As an admin, you can edit, feature, publish, or remove any property. You can also add an iCal link to keep the property's availability updated."
              : "You can add, edit, or delete your properties. Use the Calendar button to add an external iCal link to update availability or block dates."}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/account/properties/new"
            className="block rounded-md bg-teal-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Add property
          </a>
        </div>
      </div>

      {/* Property Cards */}
      <div className="mt-8 space-y-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            actions={
              <PrivateActions
                property={property}
                onToggleField={onToggleField}
                onDelete={onDelete}
              />
            }
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <Pagination
        fromProperty={fromProperty}
        toProperty={toProperty}
        totalResults={totalResults}
        onNext={onNext}
        onPrevious={onPrevious}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}

PropertyIndex.propTypes = {
  properties: PropTypes.array.isRequired,
  fromProperty: PropTypes.number.isRequired,
  toProperty: PropTypes.number.isRequired,
  totalResults: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onToggleField: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  user: PropTypes.object,
  role: PropTypes.string,
};
