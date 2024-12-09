"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseClient"; // Firestore client import
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore functions
import PropertyForm from "@/app/components/PropertyForm";

export default function EditProperty() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("this is the id", id);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!property) {
    return <p>Property not found.</p>;
  }

  // Update the property in Firestore
  const handleUpdate = async (updatedProperty) => {
    try {
      const propertyRef = doc(db, "properties", id);
      await updateDoc(propertyRef, updatedProperty); // Update the document in Firestore
    } catch (err) {
      throw new Error("Failed to update property: " + err.message);
    }
  };

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  if (!property) {
    return <p>Property not found.</p>;
  }

  return (
    <main>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Edit Your Property
      </h2>
      <PropertyForm defaultValues={property} onSubmit={handleUpdate} />
    </main>
  );
}
