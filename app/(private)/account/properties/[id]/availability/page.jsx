"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import {
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
} from "@/app/utils/firestoreActions";

import LoadingCalendar from "@/app/components/LoadingCalendar";
import AvailabilityCalendar from "@/app/components/AvailabilityCalendar";
import AvailabilityModal from "@/app/components/AvailabilityModal";
import AlertModal from "@/app/components/AlertModal";

export default function Availability() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    title: "",
    start: null,
    end: null,
  });

  const [icalLink, setIcalLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleAddIcalLink = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateDocument("properties", id, { ical: icalLink });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save iCal link:", err);
      setError("Failed to save iCal link. Please try again.");
    }
  };

  const fetchIcalLink = async () => {
    try {
      const property = await getDocument("properties", id);
      if (property?.ical) {
        setIcalLink(property.ical);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      setError("Failed to fetch property data. Please try again.");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`/api/availability?property-id=${id}`);
      const data = await response.json();

      if (response.ok) {
        setEvents(data);
      } else {
        console.error("Error fetching events:", data.error);
        setError("Failed to fetch events. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (selectInfo) => {
    setModalData({
      id: null,
      title: "",
      start: selectInfo.start,
      end: selectInfo.end,
    });
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    const { id, title, start, end, extendedProps } = clickInfo.event;
    if (extendedProps.source === "external") {
      alert("This is an external event and cannot be edited.");
      return;
    }
    setModalData({ id, title, start: new Date(start), end: new Date(end) });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const formattedEvent = {
        title: modalData.title,
        start: modalData.start ? modalData.start.toISOString() : null,
        end: modalData.end ? modalData.end.toISOString() : null,
        source: "db",
        propertyId: modalData.propertyId || id,
      };

      if (modalData.id) {
        await updateDocument("events", modalData.id, formattedEvent);

        setEvents((prev) =>
          prev.map((event) =>
            event.id === modalData.id ? { ...event, ...formattedEvent } : event
          )
        );
      } else {
        const docId = await createDocument("events", formattedEvent);
        setEvents((prev) => [...prev, { id: docId, ...formattedEvent }]);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    if (!modalData.id) return;

    try {
      await deleteDocument("events", modalData.id);
      setEvents((prev) => prev.filter((event) => event.id !== modalData.id));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData({ id: null, title: "", start: null, end: null });
  };

  useEffect(() => {
    fetchIcalLink();
    fetchEvents();
  }, []);

  return (
    <>
      <main className="p-6">
        <h1 className="text-xl font-bold mb-4 text-center">Availability</h1>
        {isLoading ? (
          <LoadingCalendar />
        ) : (
          <>
            <div className="my-6">
              {!isEditing ? (
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>iCal Link:</strong>{" "}
                    {icalLink ? (
                      <a
                        href={icalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-600 underline"
                      >
                        {icalLink}
                      </a>
                    ) : (
                      "No iCal link added"
                    )}
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                  >
                    {icalLink ? "Edit" : "Add"} iCal Link
                  </button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {icalLink ? "Edit iCal Link" : "Add iCal Link"}
                  </label>
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="url"
                      value={icalLink}
                      onChange={(e) => setIcalLink(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 flex-grow"
                      placeholder="Enter iCal link"
                    />
                    <button
                      onClick={handleAddIcalLink}
                      className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <AvailabilityCalendar
              events={events}
              handleDateSelect={handleDateSelect}
              handleEventClick={handleEventClick}
            />
          </>
        )}
      </main>
      {isModalOpen && (
        <AvailabilityModal
          modalData={modalData}
          setModalData={setModalData}
          closeModal={closeModal}
          handleSave={handleSave}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}
