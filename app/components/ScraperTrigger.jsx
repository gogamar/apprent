"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function ScraperTrigger() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, loading: userLoading } = useUser();

  // Handle the loading state of user authentication
  if (userLoading) {
    return <p>Loading user information...</p>;
  }

  // Handle unauthenticated users gracefully
  if (!user) {
    return <p>User not authenticated.</p>;
  }

  const handleTriggerScraper = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to trigger scraper");
      }

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleTriggerScraper}
        disabled={loading}
        className={`rounded-md px-4 py-2 text-white ${
          loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
        }`}
      >
        {loading ? "Scraping..." : "Trigger Scraper"}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {success && (
        <p className="mt-4 text-green-500">Scraper triggered successfully!</p>
      )}
    </div>
  );
}
