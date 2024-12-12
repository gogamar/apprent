import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function AvailabilityCalendar({
  events,
  handleDateSelect,
  handleEventClick,
}) {
  const renderEventContent = (eventInfo) => {
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
        <div>{eventInfo.event.title}</div>
      </div>
    );
  };
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable
      editable
      events={events}
      select={handleDateSelect}
      eventClick={handleEventClick}
      eventContent={renderEventContent}
      eventDisplay="block"
      eventClassNames="text-wrap p-x-2"
    />
  );
}
