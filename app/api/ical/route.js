import { NextResponse } from "next/server";
import ical from "ical";

const mergeConsecutiveEvents = (events) => {
  events.sort((a, b) => new Date(a.start) - new Date(b.start));

  const mergedEvents = [];
  let currentRange = null;

  events.forEach((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    if (!currentRange) {
      // Start a new range
      currentRange = { start: eventStart, end: eventEnd };
    } else {
      // Check if the current event is consecutive
      if (eventStart.getTime() === currentRange.end.getTime()) {
        // Extend the current range
        currentRange.end = eventEnd;
      } else {
        // Finalize the current range and start a new one
        mergedEvents.push(currentRange);
        currentRange = { start: eventStart, end: eventEnd };
      }
    }
  });

  if (currentRange) {
    mergedEvents.push(currentRange);
  }

  return mergedEvents.map((range) => {
    const start = new Date(range.start);
    const end = new Date(range.end);

    // Set start time to noon (12:00 PM)
    start.setHours(12, 0, 0, 0);

    // Set end time to 11:59 AM
    end.setHours(11, 59, 0, 0);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  });
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomid = searchParams.get("roomid");

  if (!roomid) {
    return NextResponse.json({ error: "roomid is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://secure.illacat.com/api/ical/bookings.ics?roomid=${roomid}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch iCal data" },
        { status: response.status }
      );
    }

    const icalText = await response.text();
    const parsedData = ical.parseICS(icalText);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of today

    // Transform iCal data into FullCalendar-compatible format
    const events = Object.values(parsedData)
      .filter((component) => component.type === "VEVENT")
      .map((event) => ({
        start: new Date(event.start),
        end: new Date(event.end),
      }))
      .filter((event) => event.start > today); // Exclude past events

    // Condense consecutive events
    const condensedEvents = mergeConsecutiveEvents(events);

    return NextResponse.json(condensedEvents);
  } catch (error) {
    console.error("Error parsing iCal data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
