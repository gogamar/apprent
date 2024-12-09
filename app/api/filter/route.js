import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

let cachedData = null; // Cache for views and locations

export async function GET() {
  try {
    // Check if the cache exists
    if (!cachedData) {
      console.log("Cache not available. Fetching from Firestore...");

      const propertiesRef = db.collection("properties");
      const snapshot = await propertiesRef.get();

      const viewsSet = new Set();
      const locationsSet = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();

        console.log("this is data", data);

        // Extract views
        if (data.views && Array.isArray(data.views)) {
          data.views.forEach((view) => viewsSet.add(view));
        }

        // Extract locations
        if (data.location && typeof data.location === "string") {
          locationsSet.add(data.location);
        }
      });

      // Cache the data
      cachedData = {
        views: Array.from(viewsSet),
        locations: Array.from(locationsSet),
      };

      console.log("Data cached successfully.");
    } else {
      console.log("Serving from cache.");
    }

    return NextResponse.json(cachedData, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
