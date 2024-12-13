"use client";

import { useEffect, useState, useMemo } from "react";

import { useAuthContext } from "@/app/context/AuthContext";
import { db } from "@/lib/firebaseClient";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import {
  paginateItems,
  calculatePaginationRange,
} from "@/app/utils/pagination";

import PropertyIndex from "@/app/components/PropertyIndex";
import AlertLink from "@/app/components/AlertLink";
import LoadingIndex from "@/app/components/LoadingIndex";

export default function OwnProperties() {
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuthContext();
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;

    const fetchProperties = async () => {
      setLoading(true);

      try {
        const token = await user.getIdToken();
        const response = await fetch(`/api/properties`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const properties = await response.json();

        if (response.ok) {
          setProperties(properties);
        } else {
          console.error("Error fetching properties:", properties.error);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  const totalResults = properties.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const currentProperties = useMemo(
    () => paginateItems(properties, currentPage, itemsPerPage),
    [currentPage, properties]
  );

  const { fromProperty, toProperty } = calculatePaginationRange(
    currentPage,
    itemsPerPage,
    totalResults
  );

  const handleToggleField = async (propertyId, field, newValue) => {
    const docRef = doc(db, "properties", propertyId);
    try {
      await updateDoc(docRef, {
        [field]: newValue,
      });

      setProperties((prevProperties) =>
        prevProperties.map((property) =>
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
        await deleteDoc(doc(db, "properties", propertyId));

        setProperties((prevProperties) =>
          prevProperties.filter((p) => p.id !== propertyId)
        );
      } catch (error) {
        console.error("Failed to delete property", error);
      }
    }
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  if (loading) {
    return <LoadingIndex />;
  }

  if (user && properties && properties.length === 0) {
    const alertText = `Hello ${user.displayName}! You haven't added any properties yet.`;
    const alertUrl = "/account/properties/new";
    const actionText = "Add a new property";
    return (
      <AlertLink
        alertText={alertText}
        actionUrl={alertUrl}
        actionText={actionText}
      />
    );
  }

  return (
    <PropertyIndex
      properties={currentProperties}
      fromProperty={fromProperty}
      toProperty={toProperty}
      totalResults={totalResults}
      currentPage={currentPage}
      totalPages={totalPages}
      onNext={handleNext}
      onPrevious={handlePrevious}
      onToggleField={handleToggleField}
      onDelete={handleDelete}
      user={user}
      role={role}
    />
  );
}
