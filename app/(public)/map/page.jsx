import { adminDb } from "@/lib/firebaseAdmin";
import MapClientWrapper from "@/app/components/MapClientWrapper";
import LoadingMap from "@/app/loading/LoadingMap";

export default async function PropertiesMap() {
  // Fetch properties directly from Firestore
  const propertiesRef = adminDb.collection("properties");
  const snapshot = await propertiesRef.get();

  const properties = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      siteUrl: data.siteUrl || "",
      mainImageUrl: data.mainImageUrl || "",
      address: data.address || "",
      country: data.country || "",
      title: data.title || "",
      coordinates: [data.longitude, data.latitude], // Ensure [lng, lat] format
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
    };
  });

  // Show a loading state if no properties are fetched
  if (properties.length === 0) {
    return <LoadingMap />;
  }

  return (
    <MapClientWrapper
      properties={properties}
      center={properties[0]?.coordinates || [0, 0]} // Default center
      zoom={12}
    />
  );
}
