import BookButton from "@/app/components/BookButton";
import HeartButtonClientWrapper from "@/app/components/HeartButtonClientWrapper";
import { CheckIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

const capitalizeFirstLetter = (str) => {
  if (!str) return ""; // Handle empty strings
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export default function PropertyCard({
  companyName,
  siteUrl,
  mainImageUrl,
  location,
  address,
  title,
  score,
  propertyType,
  bathrooms,
  kitchens,
  bedrooms,
  highlights,
  views,
}) {
  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:scale-105">
      {/* Main Card Link */}
      <a
        href={siteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Image Section */}
        <div className="relative">
          {/* Image */}
          <img
            src={mainImageUrl}
            alt={title}
            className="w-full h-56 object-cover"
          />

          {/* Badge score */}
          {score && (
            <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold py-1 px-2 rounded flex items-center shadow-lg">
              <StarIcon className="h-3 text-white mr-1" />
              {score}
            </div>
          )}
          {/* Views */}
          {views && views.length > 0 && (
            <div className="flex flex-wrap gap-1 p-1 absolute bottom-0">
              {views
                .filter((view) => view.toLowerCase() !== "view")
                .map((view, index) => (
                  <div
                    key={index}
                    className="bg-black opacity-75 text-white text-xs font-bold py-1 px-2 rounded flex items-center shadow-lg"
                  >
                    {view}
                  </div>
                ))}
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
            {
              <>
                {propertyType && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    {capitalizeFirstLetter(propertyType)}
                  </p>
                )}
                {bathrooms && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    {bathrooms} {bathrooms != 1 ? "bathrooms" : "bathroom"}
                  </p>
                )}
                {kitchens && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    {kitchens} {kitchens != 1 ? "kitchens" : "kitchen"}
                  </p>
                )}
                {bedrooms && (
                  <p className="flex items-center">
                    <CheckIcon className="h-3 text-teal-500 mr-2" />
                    {bedrooms} {bedrooms != 1 ? "bedrooms" : "bedroom"}
                  </p>
                )}
                {highlights &&
                  highlights
                    .filter(
                      (highlight) => !highlight.toLowerCase().includes("view")
                    )
                    .map((highlight, index) => (
                      <p key={index} className="flex items-center">
                        <CheckIcon className="h-3 text-teal-500 mr-2" />
                        {highlight}
                      </p>
                    ))}
              </>
            }
          </div>
        </div>
      </a>

      {/* Heart Button */}
      <div className="absolute top-3 right-3 z-10">
        <HeartButtonClientWrapper />
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-3 flex justify-center">
        <BookButton companyName={companyName} href={siteUrl} />
      </div>
    </div>
  );
}
