"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PropertyForm({ defaultValues = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    siteUrl: "",
    mainImageUrl: "",
    title: "",
    propertyType: "",
    bedrooms: 0,
    livingRooms: 0,
    bathrooms: 0,
    kitchens: 0,
    size: 0,
    address: "",
    latitude: "",
    longitude: "",
    town: "",
    country: "",
    highlights: "",
    views: "",
    companyName: "",
    ...defaultValues,
  });

  const [imageSource, setImageSource] = useState(
    defaultValues.mainImageUrl ? "external" : "upload"
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingAddress, setIsValidatingAddress] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSourceChange = (e) => {
    const { value } = e.target;
    setImageSource(value);

    setFormData((prev) => ({
      ...prev,
      mainImageUrl:
        value === "upload" && uploadedImageUrl
          ? uploadedImageUrl
          : prev.mainImageUrl,
    }));
  };

  const handleUploadImage = async (file) => {
    if (!file) return;

    try {
      setIsLoading(true);
      const uploadedUrl = await simulateImageUpload(file);
      setUploadedImageUrl(uploadedUrl);
      setFormData((prev) => ({
        ...prev,
        mainImageUrl: uploadedUrl,
      }));
    } catch (err) {
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateAddress = async () => {
    const { address } = formData;

    if (!address) {
      setError("Please enter an address.");
      return;
    }

    setIsValidatingAddress(true);
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxToken}`
      );

      if (!response.ok) {
        throw new Error("Failed to validate address. Please try again.");
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error(
          "No valid address found. Please enter a different address."
        );
      }

      const bestMatch = data.features[0];
      const city =
        bestMatch.context?.find((c) => c.id.includes("place"))?.text || "";

      const country =
        bestMatch.context?.find((c) => c.id.includes("country"))?.text || "";
      setFormData((prev) => ({
        ...prev,
        latitude: bestMatch.center[1],
        longitude: bestMatch.center[0],
        town: city || bestMatch.place_name,
        country: country,
      }));
      setError("");
    } catch (err) {
      setError(err.message || "Error validating address.");
    } finally {
      setIsValidatingAddress(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await onSubmit(formData);
      router.push("/account/properties");
    } catch (err) {
      setError(err.message || "Failed to save property.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateImageUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
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
      <div className="grid grid-cols-1 gap-6">
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
            placeholder="Beautiful Apartment with Sea Views"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        <div className="flex space-x-6">
          {/* Left Column: Larger Image */}
          <div className="flex-1">
            {formData.mainImageUrl ? (
              <div className="w-full h-64 border rounded overflow-hidden">
                <img
                  src={formData.mainImageUrl}
                  alt="Larger preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-64 border rounded flex items-center justify-center text-gray-500">
                No Image Selected
              </div>
            )}
          </div>

          {/* Right Column: Image Source Options */}
          <div className="flex-1">
            {/* Image Source Selection */}
            <div>
              <p className="block text-sm font-medium text-gray-700">
                Image Source
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex flex-col">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="imageSource"
                      value="external"
                      checked={imageSource === "external"}
                      onChange={handleImageSourceChange}
                      className="mr-2"
                    />
                    External URL
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="imageSource"
                      value="upload"
                      checked={imageSource === "upload"}
                      onChange={handleImageSourceChange}
                      className="mr-2"
                    />
                    Upload Image
                  </label>
                </div>
              </div>
            </div>

            {/* External Image URL */}
            {imageSource === "external" && (
              <div className="mt-4">
                <label
                  htmlFor="mainImageUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image URL
                </label>
                <input
                  type="text"
                  id="mainImageUrl"
                  name="mainImageUrl"
                  value={formData.mainImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
            )}

            {/* Upload Image */}
            {imageSource === "upload" && (
              <div className="mt-4">
                <label
                  htmlFor="imageUpload"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={(e) => handleUploadImage(e.target.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-teal-600 file:py-1 file:px-2 file:text-white file:hover:bg-teal-500"
                />
                {uploadedImageUrl && (
                  <p className="mt-2 text-sm text-teal-600">
                    Image uploaded successfully!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label
            htmlFor="propertyType"
            className="block text-sm font-medium text-gray-700"
          >
            Property Type
          </label>
          <select
            id="propertyType"
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          >
            <option value="" disabled>
              Select a property type
            </option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
          </select>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bedrooms */}
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          {/* Bathrooms */}
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>

          {/* Kitchens */}
          <div>
            <label
              htmlFor="kitchens"
              className="block text-sm font-medium text-gray-700"
            >
              Kitchens
            </label>
            <input
              type="number"
              id="kitchens"
              name="kitchens"
              value={formData.kitchens}
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Main Street 123, City, Country"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
          <button
            type="button"
            onClick={validateAddress}
            disabled={isValidatingAddress}
            className="mt-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            {isValidatingAddress ? "Validating..." : "Validate Address"}
          </button>
        </div>

        {/* Latitude */}
        <div>
          <label
            htmlFor="latitude"
            className="block text-sm font-medium text-gray-700"
          >
            Latitude
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            readOnly
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Longitude */}
        <div>
          <label
            htmlFor="longitude"
            className="block text-sm font-medium text-gray-700"
          >
            Longitude
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            readOnly
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Town */}
        <div>
          <label
            htmlFor="town"
            className="block text-sm font-medium text-gray-700"
          >
            Town
          </label>
          <input
            type="text"
            id="town"
            name="town"
            value={formData.town}
            readOnly
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Country */}
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            readOnly
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end gap-4">
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
      </div>
    </form>
  );
}
