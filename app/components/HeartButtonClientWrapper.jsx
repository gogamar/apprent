"use client";

import HeartButton from "../components/HeartButton";

export default function HeartButtonClientWrapper() {
  const handleFavoriteToggle = () => {
    console.log("Heart button clicked!");
  };

  return (
    <HeartButton
      isFavoriteInitial={false}
      onFavoriteToggle={handleFavoriteToggle}
    />
  );
}
