export default function BookButton({ companyName, href }) {
  const textColor =
    companyName === "Booking.com" ? "text-[#003b95]" : "text-[#00a699]";

  return (
    <div className="mt-6 flex items-center justify-end border-t border-gray-200 pt-4">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${textColor} relative inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-100 hover:border-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 focus:outline-none transition`}
      >
        <span>Book on {companyName}</span>
        <span
          className={`transform transition-transform duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-1`}
        >
          →
        </span>
      </a>
    </div>
  );
}
