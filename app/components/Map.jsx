import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const Map = ({ locations = [], center, zoom }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: center,
      zoom: zoom,
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (locations.length > 0) {
      // Create a bounds object
      const bounds = new mapboxgl.LngLatBounds();

      // Add markers and extend bounds for each location
      locations.forEach((location) => {
        const popupContent = `
        <a
          href="${location.baseUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="block max-w-xs rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-0 border-none"
        >
          <img
            src="${location.mainImageUrl}"
            alt="${location.title}"
            class="w-full h-32 object-cover"
          />
          <div class="p-4">
            <h6 class="text-sm font-semibold text-gray-800">${location.title}</h6>
          </div>
        </a>
      `;

        // Create a marker with a popup
        new mapboxgl.Marker()
          .setLngLat(location.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 0 }).setHTML(popupContent)) // Use setHTML for custom HTML content
          .addTo(map);

        bounds.extend(location.coordinates);
      });

      // Fit the map to the bounds
      map.fitBounds(bounds, {
        padding: 50, // Add padding around the bounds
      });
    }

    // Cleanup on component unmount
    return () => map.remove();
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: "100%",
        height: "500px",
      }}
    />
  );
};

export default Map;
