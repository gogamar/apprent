"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  // Locations in Barcelona
  const locations = [
    {
      name: "Sagrada Familia",
      coordinates: [2.1744, 41.4036],
    },
    {
      name: "Park Güell",
      coordinates: [2.1527, 41.4145],
    },
    {
      name: "La Rambla",
      coordinates: [2.1754, 41.379],
    },
  ];

  return (
    <div>
      <Map locations={locations} center={locations[0].coordinates} zoom={12} />
    </div>
  );
}
