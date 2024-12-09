"use client";

import PropertyForm from "@/app/components/PropertyForm";
import { saveProperty } from "@/app/utils/saveProperty";

export default function AddProperty() {
  const handleSubmit = async (formData) => {
    try {
      const propertyId = await saveProperty(formData);
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
