"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addProperty } from "@/app/utils/saveProperty";
import { uploadImageToCloudinary } from "../../../lib/cloudinary";

export default function AddProperty() {
  const [formData, setFormData] = useState({
    websiteUrl: "",
    location: "",
    title: "",
    propertyType: "",
    numberOfRooms: 0,
    numberOfBathrooms: 0,
    numberOfKitchens: 0,
    size: 0,
  });
  const [imageUrls, setImageUrls] = useState([]); // Array of all image URLs
  const [currentExternalUrl, setCurrentExternalUrl] = useState(""); // External URL being entered
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("number") || name === "size" ? Number(value) : value,
    }));
  };

  const handleAddExternalUrl = () => {
    if (currentExternalUrl) {
      setImageUrls((prev) => [...prev, currentExternalUrl]); // Add the URL to the array
      setCurrentExternalUrl(""); // Reset input field
    }
  };

  const handleRemoveImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index)); // Remove image by index
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Ensure at least one image is added
    if (imageUrls.length === 0) {
      setError("You must add at least one image (external or uploaded).");
      return;
    }

    setIsLoading(true);

    try {
      const propertyData = {
        ...formData,
        imageUrls, // Include all added images
      };

      console.log(propertyData);

      await addProperty(propertyData);

      // Redirect after success
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      {error && (
        <p className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-4 text-sm text-green-600 bg-green-100 p-2 rounded-md">
          Property added successfully!
        </p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Agency name */}
        <div>
          <label
            htmlFor="agencyName"
            className="block text-sm font-medium text-gray-700"
          >
            Your agency name that will be displayed as Book with [Agency Name]
          </label>
          <input
            type="text"
            id="agencyName"
            name="agencyName"
            value={formData.agencyName}
            onChange={handleChange}
            placeholder="Agency Name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Website URL */}
        <div>
          <label
            htmlFor="websiteUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Your direct website URL (where users can see the property and book)
          </label>
          <input
            type="text"
            id="websiteUrl"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            placeholder="https://example.com"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            id="imageUpload"
            name="imageUpload"
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  setIsLoading(true);
                  const uploadedUrl = await uploadImageToCloudinary(file); // Upload to Cloudinary
                  setImageUrls((prev) => [...prev, uploadedUrl]); // Add uploaded image URL
                } catch (err) {
                  setError("Failed to upload image");
                } finally {
                  setIsLoading(false);
                }
              }
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-teal-600 file:py-1 file:px-2 file:text-white file:hover:bg-teal-500"
          />
        </div>

        {/* Add External Image URLs */}
        <div>
          <label
            htmlFor="externalImageUrls"
            className="block text-sm font-medium text-gray-700"
          >
            Add External Image URLs (Up to 3)
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              id="externalImageUrls"
              value={currentExternalUrl}
              onChange={(e) => setCurrentExternalUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddExternalUrl}
              className="mt-1 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Add
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div>
          <p className="text-sm font-medium text-gray-700">Image Preview</p>
          <div className="mt-2 flex flex-wrap gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="h-32 w-32 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Property Type */}
        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium text-gray-700"
          >
            Property Type
          </label>
          <input
            type="text"
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            placeholder="Apartment, House"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
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
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
