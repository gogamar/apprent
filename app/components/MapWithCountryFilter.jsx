import { useState, useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapWithCountryFilter({ locations = [], center, zoom }) {
  const mapContainerRef = useRef(null);
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [selectedCountries, setSelectedCountries] = useState([]);

  const uniqueCountries = useMemo(() => {
    const countrySet = new Set(
      locations.map((loc) => loc.country).filter(Boolean)
    );
    return Array.from(countrySet);
  }, [locations]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCountries((prev) =>
      checked ? [...prev, value] : prev.filter((country) => country !== value)
    );
  };

  useEffect(() => {
    if (selectedCountries.length === 0) {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations.filter((loc) => selectedCountries.includes(loc.country))
      );
    }
  }, [selectedCountries, locations]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center,
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (filteredLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredLocations.forEach((location) => {
        const popupContent = `
          <a href="${location.siteUrl}" target="_blank" rel="noopener noreferrer">
            <img src="${location.mainImageUrl}" alt="${location.title}" />
            <h6>${location.title}</h6>
          </a>
        `;

        new mapboxgl.Marker({ color: "#15b8a6" })
          .setLngLat(location.coordinates)
          .setPopup(new mapboxgl.Popup().setHTML(popupContent))
          .addTo(map);
        bounds.extend(location.coordinates);
      });
      map.fitBounds(bounds, { padding: 50 });
    }

    return () => map.remove();
  }, [filteredLocations, center, zoom]);

  return (
    <div className="relative">
      {uniqueCountries.length > 0 && (
        <div
          className="absolute top-4 left-4 bg-gray-700 opacity-75 p-6 rounded-lg shadow-2xl z-10 w-64 border border-gray-200"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <h4 className="mb-4 text-white border-b pb-2">Filter by country</h4>
          {uniqueCountries.map((country) => (
            <label
              key={country}
              className="flex items-center mb-3 text-sm text-white hover:text-teal-600 transition duration-150"
            >
              <input
                type="checkbox"
                value={country}
                onChange={handleCheckboxChange}
                checked={selectedCountries.includes(country)}
                className="mr-3 h-4 w-4 rounded border-gray-300 text-teal-600 focus:outline-none focus:ring-0"
              />
              {country}
            </label>
          ))}
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-[500px]" />
    </div>
  );
}
