"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import { updateDocument, deleteDocument } from "@/app/utils/firestoreActions";
import PropertyCard from "./PropertyCard";
import Pagination from "./Pagination";
import PrivateActions from "./PrivateActions";
import AlertLink from "./AlertLink";

export default function PropertyIndex({ initialProperties }) {
  const [properties, setProperties] = useState(initialProperties);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleToggleField = async (propertyId, field, newValue) => {
    try {
      await updateDocument("properties", propertyId, { [field]: newValue });
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, [field]: newValue }
            : property
        )
      );
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await deleteDocument("properties", propertyId);
        setProperties((prev) =>
          prev.filter((property) => property.id !== propertyId)
        );
      } catch (error) {
        console.error("Failed to delete property", error);
      }
    }
  };

  const totalResults = properties.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const currentProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (properties.length === 0) {
    const alertText = "You haven't added any properties yet.";
    const alertUrl = "/account/properties/new";
    const actionText = "Add your first property";
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
    <div>
      {/* Property Cards */}
      <div className="mt-8 space-y-6">
        {currentProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            actions={
              <PrivateActions
                property={property}
                onToggleField={handleToggleField}
                onDelete={handleDelete}
              />
            }
          />
        ))}
      </div>

      {/* Render pagination */}
      <Pagination
        fromProperty={(currentPage - 1) * itemsPerPage + 1}
        toProperty={Math.min(currentPage * itemsPerPage, totalResults)}
        totalResults={totalResults}
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}

PropertyIndex.propTypes = {
  initialProperties: PropTypes.array.isRequired,
};
