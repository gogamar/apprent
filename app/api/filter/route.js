import { db } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

let cachedData = null;

export async function GET() {
  try {
    if (!cachedData) {
      console.log("Cache not available. Fetching from Firestore...");

      const propertiesRef = db.collection("properties");
      const snapshot = await propertiesRef.get();

      const viewsSet = new Set();
      const townsSet = new Set();

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.views && Array.isArray(data.views)) {
          data.views.forEach((view) => viewsSet.add(view));
        }

        if (data.town && typeof data.town === "string") {
          townsSet.add(data.town);
        }
      });

      // Cache the data
      cachedData = {
        views: Array.from(viewsSet),
        towns: Array.from(townsSet),
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
