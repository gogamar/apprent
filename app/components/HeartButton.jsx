"use client";

import { useState } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function HeartButton({ isFavoriteInitial, onFavoriteToggle }) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitial);

  const handleClick = () => {
    setIsFavorite((prev) => !prev);
    if (onFavoriteToggle) {
      onFavoriteToggle(!isFavorite);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full shadow hover:shadow-md ${
        isFavorite ? "bg-red-500" : "bg-white"
      }`}
    >
      <HeartIcon
        className={`w-5 h-5 ${isFavorite ? "text-white" : "text-gray-700"}`}
      />
    </button>
  );
}
