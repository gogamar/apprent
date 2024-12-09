"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/app/components/Map"), { ssr: false });

export default function PropertiesMap() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const fetchedProperties = await response.json();
        fetchedProperties.map((property) => {
          setLocations((prev) => [
            ...prev,
            {
              siteUrl: property.siteUrl,
              mainImageUrl: property.mainImageUrl,
              address: property.address,
              country: property.country,
              title: property.title,
              coordinates: [property.longitude, property.latitude],
            },
          ]);
        });
      } catch (err) {
        console.error("Error fetching properties:", err);
        redirect("/");
      }
    };

    fetchProperties();
  }, []);

  if (locations.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Map locations={locations} center={locations[0].coordinates} zoom={12} />
    </div>
  );
}
