"use client";

import dynamic from "next/dynamic";
import PropTypes from "prop-types";

// Dynamically import the map component (client-side only)
const MapWithCountryFilter = dynamic(
  () => import("@/app/components/MapWithCountryFilter"),
  { ssr: false }
);

export default function MapClientWrapper({ properties, center, zoom }) {
  return (
    <MapWithCountryFilter locations={properties} center={center} zoom={zoom} />
  );
}

MapClientWrapper.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      siteUrl: PropTypes.string,
      mainImageUrl: PropTypes.string,
      address: PropTypes.string,
      country: PropTypes.string,
      title: PropTypes.string,
      coordinates: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};
