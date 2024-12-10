"use client";

import PrivateActions from "./PrivateActions";
import PropertyCard from "./PropertyCard";

export default function PropertyIndex({ properties, onToggleField, onDelete }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Properties</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the properties and their details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <a
            href="/account/properties/new"
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add property
          </a>
        </div>
      </div>
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
    </div>
  );
}
