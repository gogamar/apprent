"use client";

import PropTypes from "prop-types";
import Image from "next/image";
import { CheckIcon, StarIcon } from "@heroicons/react/24/solid";
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

          {property.score && (
            <div className="absolute top-2 left-2 flex items-center gap-2 rounded-full bg-yellow-300 bg-opacity-90 px-3 py-1 text-sm font-medium text-gray-900 shadow-lg">
              <span>
                <StarIcon className="h-4 w-4 text-black opacity-25" />
              </span>
              <span>{property.score}</span>
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
          <div className="grid grid-cols-3 sm:grid-cols-6 items-center text-teal-600 sm:text-sm">
            {property.propertyType && (
              <span className="text-start">
                {capitalizeFirstLetter(property.propertyType)}
              </span>
            )}
            {property.bathrooms && (
              <span className="text-start">
                {property.bathrooms}{" "}
                {property.bathrooms == 1 ? "bathroom" : "bathrooms"}
              </span>
            )}
            {property.kitchens && (
              <span className="text-start">
                {property.kitchens}{" "}
                {property.kitchens == 1 ? "kitchen" : "kitchens"}
              </span>
            )}
            {property.bedrooms && (
              <span className="text-start">
                {property.bedrooms}{" "}
                {property.bedrooms == 1 ? "bedroom" : "bedrooms"}
              </span>
            )}
          </div>

          <p className="mt-1 sm:text-sm text-gray-600">{property.address}</p>
          <p className="sm:text-sm text-gray-500">{`${property.town}, ${property.country}`}</p>

          {/* Highlights without "view" */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1 sm:text-sm text-gray-700">
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
          {/* Views Section */}
          {property.views?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {property.views.map((view, index) => (
                <span
                  key={index}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 shadow-sm"
                >
                  {view}
                </span>
              ))}
            </div>
          )}
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
