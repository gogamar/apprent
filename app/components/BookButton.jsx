export default function BookButton({ companyName, href }) {
  const buttonTextColor =
    companyName === "Booking.com" ? "text-[#003b95]" : "text-[#00a699]";
  const buttonBgColor = "bg-gray-200";

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-3 flex justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative inline-block ${buttonTextColor} ${buttonBgColor} font-semibold py-2 px-4 rounded transition-colors duration-200 group`}
      >
        <span className="flex items-center space-x-2">
          <span>Book on {companyName}</span>
          {/* Hidden arrow, shown on hover */}
          <span className="opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
            →
          </span>
        </span>
      </a>
    </div>
  );
}
