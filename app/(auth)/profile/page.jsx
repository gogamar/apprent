"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, updateProfile } from "firebase/auth";
import app from "../../../lib/firebaseClient";
import { uploadImageToCloudinary } from "../../../lib/cloudinary";

import ProfileForm from "../ProfileForm";
import { useUser } from "@/app/context/UserContext";

export default function Profile() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
    email: "",
    displayName: "",
    avatar: null,
  });

  // Populate initialValues when the user is loaded
  useEffect(() => {
    if (user && !loading) {
      setInitialValues({
        email: user.email || "",
        displayName: user.displayName || "",
        avatar: user.photoURL || null,
      });
    }
  }, [user, loading]);

  const handleSubmit = async (e, { displayName, avatar }) => {
    e.preventDefault();

    if (!user) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      // Upload avatar to Cloudinary (if provided)
      let avatarUrl = user.photoURL; // Default to existing photoURL
      if (avatar && typeof avatar !== "string") {
        avatarUrl = await uploadImageToCloudinary(avatar);
      }

      // Update user profile with displayName and photoURL
      const auth = getAuth(app);
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: avatarUrl,
      });

      alert("Profile updated successfully!");
      router.push("/profile");
      window.location.reload(); // Forces the browser to reload the page
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return (
    <main>
      <ProfileForm
        handleSubmit={handleSubmit}
        error={error}
        submitButtonText="Update Profile"
        initialValues={initialValues}
        hideEmailAndPassword
      />
    </main>
  );
}
