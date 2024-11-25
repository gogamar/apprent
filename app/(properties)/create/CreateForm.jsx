"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateForm() {
  const [formData, setFormData] = useState({
    url: "",
    imageUrl: "",
    location: "",
    title: "",
    apartmentType: "",
    numberOfRooms: "",
    numberOfBathrooms: "",
    numberOfKitchens: "",
    size: "",
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newProperty = { ...formData, user_email: "test@test.com" };

    try {
      const res = await fetch("http://localhost:5000/directProperties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProperty),
      });

      if (res.status === 201) {
        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to submit property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* URL Field */}
        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Website URL
          </label>
          <input
            type="text"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Beautiful Apartment"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Apartment Type */}
        <div>
          <label
            htmlFor="apartmentType"
            className="block text-sm font-medium text-gray-700"
          >
            Apartment Type
          </label>
          <input
            type="text"
            id="apartmentType"
            name="apartmentType"
            value={formData.apartmentType}
            onChange={handleChange}
            placeholder="Studio, 2-Bedroom"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Number of Rooms */}
        <div>
          <label
            htmlFor="numberOfRooms"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Rooms
          </label>
          <input
            type="number"
            id="numberOfRooms"
            name="numberOfRooms"
            value={formData.numberOfRooms}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Number of Bathrooms */}
        <div>
          <label
            htmlFor="numberOfBathrooms"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Bathrooms
          </label>
          <input
            type="number"
            id="numberOfBathrooms"
            name="numberOfBathrooms"
            value={formData.numberOfBathrooms}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Number of Kitchens */}
        <div>
          <label
            htmlFor="numberOfKitchens"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Kitchens
          </label>
          <input
            type="number"
            id="numberOfKitchens"
            name="numberOfKitchens"
            value={formData.numberOfKitchens}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Size */}
        <div>
          <label
            htmlFor="size"
            className="block text-sm font-medium text-gray-700"
          >
            Size (m²)
          </label>
          <input
            type="number"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="50"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
