"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { setAuthCookie } from "@/app/utils/cookies";

import RegistrationForm from "@/app/components/RegistrationForm";
import LoadingAuth from "@/app/components/LoadingAuth";
import { getFriendlyErrorMessage } from "@/app/utils/firebaseErrorMessages";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [createUserWithEmailAndPassword, authError] =
    useCreateUserWithEmailAndPassword(auth);
  const [loading, setLoading] = useState(false); // Local loading state

  const handleSignup = async (e, { email, password, displayName, avatar }) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );

      if (!userCredential) {
        throw new Error("Failed to create user.");
      }

      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      setAuthCookie(token);

      const roleResponse = await fetch("/api/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: firebaseUser.uid }),
      });

      if (!roleResponse.ok) {
        throw new Error("Failed to assign user role.");
      }

      let avatarUrl = null;
      if (avatar) {
        avatarUrl = await uploadImageToCloudinary(avatar);
      }

      await updateProfile(firebaseUser, {
        displayName,
        photoURL: avatarUrl,
      });

      const redirectPath =
        searchParams.get("redirect") || "/account/properties";
      router.push(redirectPath);
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (loading) {
    return <LoadingAuth />;
  }

  const friendlyError = authError
    ? getFriendlyErrorMessage(authError.code)
    : null;

  return (
    <RegistrationForm
      handleSubmit={handleSignup}
      error={friendlyError}
      submitButtonText="Sign Up"
      initialValues={{
        email: "",
        password: "",
        displayName: "",
        avatar: null,
      }}
    />
  );
}
