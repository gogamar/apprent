"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";
import LoadingIndex from "@/app/components/LoadingIndex";
import PropertyIndex from "@/app/components/PropertyIndex";

export default function YourProperties() {
  const { user, role } = useAuthContext(); // Get user from context
  const [loading, setLoading] = useState(true); // Fixed loading state
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!user) return; // Wait for user to be available

    const fetchProperties = async () => {
      setLoading(true); // Set loading to true before fetching data

      try {
        const response = await fetch("/api/properties");
        const data = await response.json();

        if (response.ok) {
          // Filter properties where userId matches user.uid
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
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchProperties();
  }, [user]);

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

  return <PropertyIndex properties={properties} />;
}
