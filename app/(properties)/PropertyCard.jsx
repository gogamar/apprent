import Image from "next/image";

const PropertyCard = ({
  baseUrl,
  imageUrl,
  location,
  title,
  details,
  score,
}) => {
  return (
    <div className="max-w-md bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <a
        href={baseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>
      </a>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{location}</p>
        <ul className="text-sm text-gray-700 mt-2">
          {details.map((detail, index) => (
            <li key={index}>&bull; {detail}</li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-yellow-600 font-bold">{score}</span>
          <a
            href={baseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
