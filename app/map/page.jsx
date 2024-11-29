"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebaseClient";
const db = getFirestore(app);

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function PropertiesMap() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const fetchedLocations = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            baseUrl: data.baseUrl,
            mainImageUrl: data.mainImageUrl,
            title: data.title,
            coordinates: [data.longitude, data.latitude],
          };
        });
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching properties: ", error);
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
