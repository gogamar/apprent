"use client";

import PropertyForm from "@/app/components/PropertyForm";
import { createDocument } from "@/app/utils/firestoreActions";
import { useAuthContext } from "@/app/context/AuthContext";

export default function AddProperty() {
  const { user, role } = useAuthContext();

  const handleSubmit = async (formData) => {
    const propertyData = {
      ...formData,
      published: true,
      featured: false,
      userId: user.uid,
    };

    try {
      const propertyId = await createDocument("properties", propertyData);
      if (role === "user") {
        const response = await fetch("/api/role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid: user.uid, role: "manager" }),
        });

        if (!response.ok) {
          throw new Error("Failed to update user role");
        }
      }
    } catch (err) {
      alert("Failed to add property or update role. Please try again.");
      console.error("Error:", err);
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
