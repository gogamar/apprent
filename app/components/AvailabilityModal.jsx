import PropTypes from "prop-types";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AvailabilityModal({
  modalData,
  setModalData,
  closeModal,
  handleSave,
  handleDelete,
}) {
  const saveEvent = () => {
    const formattedEvent = {
      start: modalData.start ? modalData.start.toISOString() : null,
      end: modalData.end ? modalData.end.toISOString() : null,
      title: modalData.title,
      source: "db",
      propertyId: modalData.propertyId || null,
    };

    handleSave(formattedEvent);
  };

  return (
    <Dialog open={true} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500/75" aria-hidden="true"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPanel className="relative bg-white rounded-lg p-6 shadow-xl w-full max-w-sm">
          <div>
            <div className="mx-auto flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="mt-3 text-center">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {modalData.id ? "Edit Event" : "Add Event"}
              </DialogTitle>
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Event Title"
                  className="w-full border p-2 rounded mb-4"
                  value={modalData.title}
                  onChange={(e) =>
                    setModalData({ ...modalData, title: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block sm:text-sm font-medium mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    selected={modalData.start}
                    onChange={(date) =>
                      setModalData({ ...modalData, start: date })
                    }
                    className="w-full border p-2 rounded"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block sm:text-sm font-medium mb-1">
                    End Date
                  </label>
                  <DatePicker
                    selected={modalData.end}
                    onChange={(date) =>
                      setModalData({ ...modalData, end: date })
                    }
                    className="w-full border p-2 rounded"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex justify-between gap-2">
            <div>
              {modalData.id && (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete Event
                </button>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded"
                onClick={saveEvent}
              >
                Save
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

AvailabilityModal.propTypes = {
  modalData: PropTypes.object.isRequired,
  setModalData: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
