"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import app from "../../../lib/firebaseClient";
import ProfileForm from "../ProfileForm";
import { uploadImageToCloudinary } from "../../../lib/cloudinary";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e, { email, password, displayName, avatar }) => {
    e.preventDefault();
    const auth = getAuth(app);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload avatar to Cloudinary (if provided)
      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadImageToCloudinary(avatar);
      }

      // Update user profile with displayName and photoURL
      await updateProfile(user, {
        displayName,
        photoURL: avatarUrl,
      });

      alert("Signup successful!");
      router.push("/");
    } catch (err) {
      console.error("Error during signup:", err.message);
      setError(err.message);
    }
  };

  return (
    <main>
      <ProfileForm
        handleSubmit={handleSignup}
        error={error}
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
