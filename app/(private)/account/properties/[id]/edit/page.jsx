"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { updateProperty } from "@/app/utils/updateProperty";
import PropertyForm from "@/app/components/PropertyForm";

export default function EditProperty() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyRef = doc(db, "properties", id);
        const propertySnap = await getDoc(propertyRef);
        if (propertySnap.exists()) {
          setProperty({ id: propertySnap.id, ...propertySnap.data() });
        } else {
          console.error("Property not found.");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (updatedProperty) => {
    try {
      await updateProperty(id, updatedProperty);
      alert("Property updated successfully.");
    } catch (err) {
      console.error("Failed to update property:", err);
      alert("Failed to update property. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <main>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Edit Your Property
      </h2>
      <PropertyForm defaultValues={property} onSubmit={handleSubmit} />
    </main>
  );
}
