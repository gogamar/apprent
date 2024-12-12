export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrevious,
}) {
  if (totalPages <= 1) {
    return null; // Don't render the component if there's only one or no page
  }

  return (
    <div className="flex mt-2 justify-center items-center gap-4">
      {/* "Previous" Button */}
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1
            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-gray-500 text-white hover:bg-gray-600"
        }`}
      >
        Previous
      </button>

      {/* Page Indicators */}
      <span>
        Page {currentPage} of {totalPages}
      </span>

      {/* "Next" Button */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-teal-500 text-white hover:bg-teal-600"
        }`}
      >
        Next
      </button>
    </div>
  );
}
