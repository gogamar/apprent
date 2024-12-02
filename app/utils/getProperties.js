import { db } from "@/lib/firebaseAdmin";

export const getProperties = async () => {
  try {
    const properties = [];
    const snapshot = await db.collection("properties").get();

    snapshot.forEach((doc) => {
      properties.push(doc.data());
    });
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }
};
