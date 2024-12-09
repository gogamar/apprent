import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const getProperties = async () => {
  try {
    const snapshot = await db.collection("properties").get();

    if (snapshot.empty) {
      return [];
    }

    const properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    throw new Error("Failed to fetch properties");
  }
};

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
