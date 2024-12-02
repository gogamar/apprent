"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../../../lib/firebaseClient";
import RegistrationForm from "../RegistrationForm";
import { uploadImageToCloudinary } from "../../../lib/cloudinary";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [createUserWithEmailAndPassword, user, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignup = async (e, { email, password, displayName, avatar }) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      const firebaseUser = userCredential.user;

      // Call API to assign role
      const roleResponse = await fetch("/api/assignUserRole", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: firebaseUser.uid }),
      });

      if (!roleResponse.ok) {
        throw new Error("Failed to assign user role.");
      }

      // Upload avatar to Cloudinary (if provided)
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadImageToCloudinary(avatar);
      }

      // Update user profile with displayName and photoURL
      await updateProfile(firebaseUser, {
        displayName,
        photoURL: avatarUrl,
      });

      // Redirect to home page
      router.push("/");
    } catch (err) {
      console.error("Signup error:", err.message || "Unknown error");
      setError(err.message || "An error occurred during signup.");
    }
  };

  if (loading) {
    return <div>Creating account...</div>;
  }

  return (
    <main>
      {authError && <div className="error">{authError.message}</div>}
      {error && <div className="error">{error}</div>}
      <RegistrationForm
        handleSubmit={handleSignup}
        error={error || authError?.message}
        submitButtonText="Sign Up"
        initialValues={{
          email: "",
          password: "",
          displayName: "",
          avatar: null,
        }}
      />
    </main>
  );
}
