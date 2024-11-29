export const uploadImageToCloudinary = async (file) => {
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dyaguoeax/image/upload";
  const UPLOAD_PRESET = "unsigned_preset_vista";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url; // Cloudinary's URL for the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error.message);
    throw error;
  }
};
