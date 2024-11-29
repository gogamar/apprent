import BookButton from "../components/BookButton";
import HeartButtonClientWrapper from "../components/HeartButtonClientWrapper";
import { CheckIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function PropertyCard({
  companyName,
  baseUrl,
  imageUrl,
  location,
  title,
  details,
  score,
  propertyType,
  numberOfBathrooms,
  numberOfKitchens,
  numberOfRooms,
}) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:scale-105">
      {/* Main Card Link */}
      <a
        href={baseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Image Section */}
        <div className="relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-56 object-cover"
          />
          {score && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold py-1 px-2 rounded flex items-center">
              <StarIcon className="h-3 text-white mr-1" /> {score}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 pb-16">
          {" "}
          {/* Add padding at the bottom for the footer */}
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500">{location}</p>
          <div className="mt-3 text-sm text-gray-700 space-y-1">
            {details ? (
              details.map((detail, index) => (
                <p key={index} className="flex items-center">
                  <CheckIcon className="h-3 text-teal-500 mr-2" />
                  {detail}
                </p>
              ))
            ) : (
              <>
                {propertyType && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    Type: {propertyType}
                  </p>
                )}
                {numberOfBathrooms && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    Bathrooms: {numberOfBathrooms}
                  </p>
                )}
                {numberOfKitchens && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    Kitchens: {numberOfKitchens}
                  </p>
                )}
                {numberOfRooms && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    Rooms: {numberOfRooms}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </a>

      {/* Heart Button */}
      <div className="absolute top-3 right-3 z-10">
        <HeartButtonClientWrapper />
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-3 flex justify-center">
        <BookButton companyName={companyName} href={baseUrl} />
      </div>
    </div>
  );
}
