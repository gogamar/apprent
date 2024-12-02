"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

import RegistrationForm from "../RegistrationForm";

export default function Profile() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [updateError, setUpdateError] = useState("");
  const [initialValues, setInitialValues] = useState({
    email: "",
    displayName: "",
    avatar: null,
  });

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
      setUpdateError("No user is currently logged in.");
      return;
    }

    try {
      let avatarUrl = user.photoURL;
      if (avatar && typeof avatar !== "string") {
        avatarUrl = await uploadImageToCloudinary(avatar);
      }

      // Update user profile with displayName and photoURL
      await updateProfile(user, {
        displayName,
        photoURL: avatarUrl,
      });

      router.push("/");
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setUpdateError(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <main>
      {updateError && <div className="error">{updateError}</div>}
      <RegistrationForm
        handleSubmit={handleSubmit}
        error={updateError}
        submitButtonText="Update Profile"
        initialValues={initialValues}
        hideEmailAndPassword
      />
    </main>
  );
}
