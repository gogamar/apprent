"use client";

import PropTypes from "prop-types";

import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/outline";
import HeartButtonClientWrapper from "@/app/components/HeartButtonClientWrapper";

const capitalizeFirstLetter = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default function PropertyCard({ property, actions }) {
  return (
    <article className="relative isolate flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md lg:flex-row">
      {/* Image Section */}
      <a href={property.siteUrl} target="_blank" className="relative block">
        <div className="relative aspect-video sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
          <Image
            alt={property.title || "Property Image"}
            src={property.mainImageUrl || "/placeholder-image.jpg"}
            fill
            className="absolute inset-0 rounded-lg object-cover"
            sizes="(max-width: 1024px) 100vw, 33vw"
            priority
          />

          {/* Views Overlay */}
          {property.views?.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-2">
              {property.views.map((view, index) => (
                <span
                  key={index}
                  className="rounded-full bg-black bg-opacity-75 px-3 py-1 text-xs text-white shadow-md"
                >
                  {view}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>

      {/* Details Section */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Title and Highlights */}
        <div>
          <div className="flex items-center justify-between">
            <a href={property.siteUrl} target="_blank">
              <h3 className="text-lg font-semibold text-gray-900 hover:underline">
                {property.title}
              </h3>
            </a>
            <div className="text-xs font-medium text-gray-500">
              <HeartButtonClientWrapper />
            </div>
          </div>
          <div className="flex items-center text-teal-600 text-sm space-x-2">
            {property.propertyType && (
              <span>{capitalizeFirstLetter(property.propertyType)}</span>
            )}
            {property.bathrooms && (
              <span>
                {property.bathrooms}{" "}
                {property.bathrooms == 1 ? "bathroom" : "bathrooms"}
              </span>
            )}
            {property.kitchens && (
              <span>
                {property.kitchens}{" "}
                {property.kitchens == 1 ? "kitchen" : "kitchens"}
              </span>
            )}
            {property.bedrooms && (
              <span>
                {property.bedrooms}{" "}
                {property.bedrooms == 1 ? "bedroom" : "bedrooms"}
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-gray-600">{property.address}</p>
          <p className="text-sm text-gray-500">{`${property.town}, ${property.country}`}</p>

          {/* Additional Details in 3 Columns */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 text-sm text-gray-700">
            {property.highlights &&
              property.highlights
                .filter(
                  (highlight) => !highlight.toLowerCase().includes("view")
                )
                .map((highlight, index) => (
                  <li key={index} className="flex items-center">
                    <CheckIcon className="h-3 w-5 text-teal-500 mr-2" />
                    {highlight}
                  </li>
                ))}
          </div>
        </div>

        {/* Actions */}
        {actions}
      </div>
    </article>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  actions: PropTypes.node.isRequired,
};
