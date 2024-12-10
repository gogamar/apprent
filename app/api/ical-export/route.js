import { NextResponse } from "next/server";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "@/lib/firebaseClient"; // Ensure correct Firebase Client setup
import { createEvents } from "ics";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("property-id");

  if (!propertyId) {
    return NextResponse.json(
      { error: "property-id is required" },
      { status: 400 }
    );
  }

  try {
    const db = getFirestore(app);

    // Fetch the property document to ensure it exists
    const propertyRef = doc(db, "properties", propertyId);
    const propertyDoc = await getDoc(propertyRef);

    if (!propertyDoc.exists()) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Fetch the events associated with the property
    const eventsCollectionRef = collection(db, "events"); // Adjust your Firestore schema if needed
    const eventsQuery = query(
      eventsCollectionRef,
      where("propertyId", "==", propertyId)
    );
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = eventsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        title: data.title || "Event",
        start: [
          data.startDate.getFullYear(),
          data.startDate.getMonth() + 1,
          data.startDate.getDate(),
          data.startDate.getHours(),
          data.startDate.getMinutes(),
        ],
        end: [
          data.endDate.getFullYear(),
          data.endDate.getMonth() + 1,
          data.endDate.getDate(),
          data.endDate.getHours(),
          data.endDate.getMinutes(),
        ],
      };
    });

    if (events.length === 0) {
      return NextResponse.json(
        { error: "No events found for this property" },
        { status: 404 }
      );
    }

    // Generate the iCal file
    const { error, value } = createEvents(events);

    if (error) {
      console.error("Error generating iCal:", error);
      return NextResponse.json(
        { error: "Failed to generate iCal file" },
        { status: 500 }
      );
    }

    return new Response(value, {
      headers: {
        "Content-Type": "text/calendar",
        "Content-Disposition": `attachment; filename="${propertyId}-events.ics"`,
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
