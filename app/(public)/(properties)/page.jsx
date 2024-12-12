"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import PropertyList from "@/app/components/PropertyList";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  // Convert searchParams to a plain object
  const params = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        const data = await response.json();

        if (response.ok) {
          setProperties(data);
        } else {
          setError(data.error || "Failed to fetch properties");
        }
      } catch (error) {
        setError(
          error.message || "An error occurred while fetching properties"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 p-6">Error: {error}</div>;
  }

  return (
    <main className="flex flex-col justify-center">
      <PropertyList
        properties={properties}
        loading={loading}
        searchParams={params}
      />
    </main>
  );
}
