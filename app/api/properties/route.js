import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

// Fetch properties from Firestore
const getProperties = async () => {
  try {
    const snapshot = await db.collection("properties").get();

    // Map through Firestore documents and include their IDs
    const properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw new Error("Failed to fetch properties");
  }
};

// Handle GET requests
export async function GET() {
  try {
    const properties = await getProperties();
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
