"use client";

import PropTypes from "prop-types";

import { useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";

export default function ScraperTrigger() {
  const affId = process.env.NEXT_PUBLIC_AFFILIATE_ID;
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: false,
  });
  const [link, setLink] = useState("");
  const [affiliateId, setAffiliateId] = useState(affId || "");
  const { user, loading: userLoading } = useAuthContext();

  if (userLoading) return <p>Loading user information...</p>;

  if (!user) return <p>User not authenticated.</p>;

  const handleTriggerScraper = async (e) => {
    e.preventDefault();
    if (!link.trim()) {
      setStatus({
        loading: false,
        error: "Link cannot be empty",
        success: false,
      });
      return;
    }

    setStatus({ loading: true, error: "", success: false });

    try {
      const idToken = await user.getIdToken();
      const response = await fetch("/api/scraper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ link, affiliateId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to trigger scraper");
      }

      setStatus({ loading: false, error: "", success: true });
      setLink("");
    } catch (err) {
      setStatus({
        loading: false,
        error:
          err instanceof Error ? err.message : "An unexpected error occurred",
        success: false,
      });
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleTriggerScraper} className="space-y-4">
        <div>
          <label
            htmlFor="scrape-link"
            className="block text-sm font-medium text-gray-700"
          >
            Link to Scrape
          </label>
          <input
            id="scrape-link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter a valid URL"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="affiliate-id"
            className="block text-sm font-medium text-gray-700"
          >
            Your Booking.com affiliate id
          </label>
          <input
            id="affiliate-id"
            type="text"
            value={affiliateId}
            onChange={(e) => setAffiliateId(e.target.value)}
            disabled
            placeholder="Enter your affiliate id"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className={`rounded-md px-4 py-2 text-white text-sm ${
            status.loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {status.loading ? "Scraping..." : "Trigger Scraper"}
        </button>
      </form>

      {status.error && <p className="mt-4 text-red-500">{status.error}</p>}
      {status.success && (
        <p className="mt-4 text-green-500">I&apos;m done scraping!</p>
      )}
    </div>
  );
}

ScraperTrigger.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool,
};
