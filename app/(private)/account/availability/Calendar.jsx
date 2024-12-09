"use client";

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/ical?roomid=54372");
        const data = await response.json();

        // Parse events into the format FullCalendar understands
        const parsedEvents = data.map((event) => ({
          title: "Event", // Add a default title if needed
          start: new Date(event.start),
          end: new Date(event.end || event.start),
        }));

        setEvents(parsedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Custom render function for events
  const renderEventContent = (eventInfo) => {
    // Format start and end dates as desired
    const startDate = eventInfo.event.start.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const endDate = eventInfo.event.end
      ? eventInfo.event.end.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : startDate;

    return (
      <div>
        <div>
          {startDate} - {endDate}
        </div>
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      editable={true}
      selectable={true}
      events={events}
      eventContent={renderEventContent} // Custom event renderer
    />
  );
};

export default Calendar;
