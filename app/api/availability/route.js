import { NextResponse } from "next/server";
import ical from "ical";
import { db } from "@/lib/firebaseAdmin";
import { getDocument } from "@/app/utils/firestoreActions";

const mergeConsecutiveEvents = (events) => {
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

  const mergedEvents = [];
  let currentRange = null;

  events.forEach((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (!currentRange) {
      currentRange = { ...event, start: eventStart, end: eventEnd };
    } else {
      if (eventStart.getTime() === currentRange.end.getTime()) {
        currentRange.end = eventEnd;
      } else {
        mergedEvents.push(currentRange);
        currentRange = { ...event, start: eventStart, end: eventEnd };
      }
    }
  });

  if (currentRange) {
    mergedEvents.push(currentRange);
  }

  return mergedEvents.map((range) => ({
    ...range,
    start: new Date(range.start).toISOString(),
    end: new Date(range.end).toISOString(),
  }));
};

const fetchExternalEvents = async (propertyId) => {
  try {
    const property = await getDocument("properties", propertyId);
    const icalLink = property.ical;

    if (!icalLink) {
      console.log("No iCal link found for the property.");
      return []; // Return an empty array if there's no iCal link
    }

    const response = await fetch(icalLink);

    if (!response.ok) {
      console.error(`Failed to fetch iCal data. Status: ${response.status}`);
      return []; // Return an empty array if fetching fails
    }

    const icalText = await response.text();
    const parsedData = ical.parseICS(icalText);

    console.log("Parsed iCal data:", parsedData);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of today

    return Object.values(parsedData)
      .filter((component) => component.type === "VEVENT")
      .map((event) => ({
        title: "External Event",
        start: event.start,
        end: event.end || event.start,
        source: "external",
        backgroundColor: "#E5E5E5",
        textColor: "#737373",
      }))
      .filter((event) => new Date(event.start) > today); // Only future events
  } catch (error) {
    console.error("Error fetching external events:", error);
    return [];
  }
};

const fetchFirestoreEvents = async (propertyId) => {
  try {
    const firestoreEventsSnapshot = await db
      .collection("events")
      .where("propertyId", "==", propertyId)
      .get();

    if (firestoreEventsSnapshot.empty) {
      return [];
    }

    return firestoreEventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      source: "db",
      backgroundColor: "#CCFBF1",
      textColor: "#0F766E",
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching Firestore events:", error);
    throw error;
  }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("property-id");

  if (!propertyId) {
    return NextResponse.json(
      { error: "Property id is required." },
      { status: 400 }
    );
  }

  let externalEvents = [];
  let firestoreEvents = [];

  try {
    externalEvents = await fetchExternalEvents(propertyId);
  } catch (error) {
    console.error("Error fetching external events:", error);
    externalEvents = [];
  }

  try {
    firestoreEvents = await fetchFirestoreEvents(propertyId);
  } catch (error) {
    console.error("Error fetching Firestore events:", error);
    firestoreEvents = [];
  }

  const condensedEvents = mergeConsecutiveEvents(externalEvents);
  const allEvents = [...condensedEvents, ...firestoreEvents];

  if (allEvents.length === 0) {
    return NextResponse.json(
      { message: "There are no events for this property." },
      { status: 200 }
    );
  }

  return NextResponse.json(allEvents);
}
