"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import LoadingIndex from "@/app/components/LoadingIndex";
import PropertyIndex from "@/app/components/PropertyIndex";
import { db } from "@/lib/firebaseClient";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

export default function YourProperties() {
  const { user, role } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchProperties = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/properties");
        const data = await response.json();

        if (response.ok) {
          const userProperties = data.filter(
            (property) => property.userId === user.uid
          );
          setProperties(userProperties);
        } else {
          console.error("Error fetching properties:", data.error);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  const handleToggleField = async (propertyId, field, newValue) => {
    const docRef = doc(db, "properties", propertyId);
    try {
      await updateDoc(docRef, {
        [field]: newValue,
      });
      // Update local state
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
        // Update local state
        setProperties((prevProperties) =>
          prevProperties.filter((p) => p.id !== propertyId)
        );
      } catch (error) {
        console.error("Failed to delete property", error);
        // Optionally show an error message to the user
      }
    }
  };

  if (loading) {
    return <LoadingIndex />;
  }

  if (properties.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 text-lg">No properties found.</p>
      </div>
    );
  }

  return (
    <PropertyIndex
      properties={properties}
      onToggleField={handleToggleField}
      onDelete={handleDelete}
      user={user}
      role={role}
    />
  );
}
