export default function BookButton({ companyName, href }) {
  const textColor =
    companyName === "Booking.com" ? "text-[#003b95]" : "text-[#00a699]";

  return (
    <div className="mt-6 flex items-center justify-end border-t border-gray-200 pt-4">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-x-1.5 rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold ${textColor} shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400`}
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
