// components/Map.js
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

    const bounds = [
      [2.0534, 41.3431], // Southwest corner of Barcelona
      [2.2275, 41.4682], // Northeast corner of Barcelona
    ];

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    if (locations.length > 0) {
      // Create a bounds object
      const bounds = new mapboxgl.LngLatBounds();

      // Add markers and extend bounds for each location
      locations.forEach((location) => {
        new mapboxgl.Marker()
          .setLngLat(location.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name)) // Add popups
          .addTo(map);

        bounds.extend(location.coordinates);
      });

      // Fit the map to the bounds
      map.fitBounds(bounds, {
        padding: 50, // Add padding around the bounds
      });
    }

    // Add markers for each location
    locations.forEach((location) => {
      new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name)) // Add popups
        .addTo(map);
    });

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
