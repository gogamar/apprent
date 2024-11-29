"use client";

export default function BookButton({ companyName, href }) {
  const buttonColor =
    companyName === "Booking.com" ? "bg-[#003b95]" : "bg-[#00a699]";
  const hoverColor =
    companyName === "Booking.com" ? "hover:bg-[#002f7a]" : "hover:bg-[#008d76]";

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-3 flex justify-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-block text-white font-semibold py-2 px-4 rounded ${buttonColor} ${hoverColor}`}
      >
        Book on {companyName}
      </a>
    </div>
  );
}
