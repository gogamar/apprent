"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

import { uploadImageToCloudinary } from "@/lib/cloudinary";

export default function PropertyForm({ defaultValues = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    siteUrl: "",
    mainImageUrl: "",
    title: "",
    propertyType: "",
    bedrooms: "",
    livingRooms: "",
    bathrooms: "",
    kitchens: "",
    size: "",
    address: "",
    latitude: "",
    longitude: "",
    town: "",
    country: "",
    highlights: [],
    views: [],
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
      const uploadedUrl = await uploadImageToCloudinary(file);
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
            Property Title
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Views */}
          <div>
            <label
              htmlFor="views"
              className="block text-sm font-medium text-gray-700"
            >
              Views
            </label>
            <div className="mt-1 space-y-2">
              {[
                "Sea view",
                "Landmark view",
                "City view",
                "Mountain view",
                "Lake view",
                "River view",
                "Garden view",
                "Pool view",
              ].map((view) => (
                <div key={view} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`view-${view}`}
                    name="views"
                    value={view}
                    checked={formData.views?.includes(view) || false}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setFormData((prev) => {
                        const views = prev.views || [];
                        if (checked) {
                          return { ...prev, views: [...views, value] };
                        } else {
                          return {
                            ...prev,
                            views: views.filter((v) => v !== value),
                          };
                        }
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label
                    htmlFor={`view-${view}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {view}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Highlights */}
          <div>
            <label
              htmlFor="highlights"
              className="block text-sm font-medium text-gray-700"
            >
              Highlights
            </label>
            <div className="mt-1 space-y-2">
              {[
                "Air conditioning",
                "Free WIFI",
                "Free Parking",
                "Private Pool",
                "Shared Pool",
              ].map((highlight) => (
                <div key={highlight} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`highlight-${highlight}`}
                    name="highlights"
                    value={highlight}
                    checked={formData.highlights?.includes(highlight) || false}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setFormData((prev) => {
                        const highlights = prev.highlights || [];
                        if (checked) {
                          return {
                            ...prev,
                            highlights: [...highlights, value],
                          };
                        } else {
                          return {
                            ...prev,
                            highlights: highlights.filter((h) => h !== value),
                          };
                        }
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label
                    htmlFor={`highlight-${highlight}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {highlight}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Your company website (will be displayed as: Book on yourwebsite.com)
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Your Company Name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>
        {/* Site Url */}
        <div>
          <label
            htmlFor="siteUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Link to your website (where clients can book your property)
          </label>
          <input
            type="text"
            id="siteUrl"
            name="siteUrl"
            value={formData.siteUrl}
            onChange={handleChange}
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
                Add an image for your property
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
                    Add a link
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700"
            >
              Property Type
            </label>
            <Select
              instanceId="property-type-select"
              id="propertyType"
              name="propertyType"
              options={[
                { value: "Apartment", label: "Apartment" },
                { value: "Villa", label: "Villa" },
              ]}
              value={
                formData.propertyType
                  ? {
                      value: formData.propertyType,
                      label: formData.propertyType,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyType: selectedOption ? selectedOption.value : "",
                }))
              }
              placeholder="Select a property type"
              isClearable
              required
              className="mt-1 block text-sm font-medium text-gray-700"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "#d1d5db",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "#14b8a6",
                  },
                }),
              }}
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

        {/* Property Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Living rooms */}
          <div>
            <label
              htmlFor="livingRooms"
              className="block text-sm font-medium text-gray-700"
            >
              Living rooms
            </label>
            <input
              type="number"
              id="livingRooms"
              name="livingRooms"
              value={formData.livingRooms}
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
            placeholder="Paseo de Gracia 50, Barcelona"
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
