import PropertyListClient from "./PropertyListClient";
import { db } from "@/lib/firebaseAdmin";

export default async function PropertyList({ searchParams }) {
  const { propertyType = null, location = null } = searchParams || {};

  let query = db.collection("properties").orderBy("createdAt", "desc");

  // Apply filters if present
  if (propertyType) {
    query = query.where("propertyType", "==", propertyType);
  }
  if (location) {
    query = query.where("location", "==", location);
  }

  try {
    const snapshot = await query.get();
    const allProperties = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      };
    });

    return <PropertyListClient allProperties={allProperties} />;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return (
      <p className="text-center text-red-500">Failed to load properties.</p>
    );
  }
}
