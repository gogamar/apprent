"use client";

import PropertyForm from "@/app/components/PropertyForm";
import { createDocument } from "@/app/utils/firestoreActions";
import { useAuthContext } from "@/app/context/AuthContext";

export default function AddProperty() {
  const { user, role } = useAuthContext();
  const handleSubmit = async (formData) => {
    const propertyData = {
      ...formData,
      published: property.published ?? true,
      featured: property.featured ?? false,
      userId: user.uid,
    };
    try {
      const propertyId = await createDocument("properties", propertyData);
      alert("Property added successfully.");
      console.log("Property created with ID:", propertyId);
    } catch (err) {
      alert("Failed to add property. Please try again.");
      console.error("Failed to add property:", err);
    }
  };

  return (
    <main>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Property
      </h2>
      <PropertyForm onSubmit={handleSubmit} />
    </main>
  );
}
