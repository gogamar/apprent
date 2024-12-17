"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import RegistrationForm from "@/app/components/RegistrationForm";
import LoadingAuth from "@/app/loading/LoadingAuth";

export default function Profile() {
  const router = useRouter();
  const [user, userLoading, userError] = useAuthState(auth);
  const [error, setError] = useState("");
  const [initialValues, setInitialValues] = useState({
    email: "",
    displayName: "",
    avatar: null,
  });

  useEffect(() => {
    if (user && !userLoading) {
      setInitialValues({
        email: user.email || "",
        displayName: user.displayName || "",
        avatar: user.photoURL || null,
      });
    }
  }, [user, userLoading]);

  const handleSubmit = async (e, { displayName, avatar }) => {
    e.preventDefault();

    if (!user) {
      setError("No user is currently logged in.");
      return;
    }

    try {
      let avatarUrl = user.photoURL;

      if (avatar && typeof avatar !== "string") {
        avatarUrl = await uploadImageToCloudinary(avatar);
      }

      await updateProfile(user, {
        displayName,
        photoURL: avatarUrl,
      });

      router.push("/");
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setError(err.message || "Failed to update profile.");
    }
  };

  if (userLoading) {
    return <LoadingAuth />;
  }

  if (userError) {
    return <div className="error">Error: {userError.message}</div>;
  }

  return (
    <main>
      {error && <div className="error text-red-500">{error}</div>}
      <RegistrationForm
        handleSubmit={handleSubmit}
        error={error}
        submitButtonText="Update Profile"
        initialValues={initialValues}
        hideEmailAndPassword
      />
    </main>
  );
}
