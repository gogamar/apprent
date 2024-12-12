"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

import LoadingAuth from "@/app/components/LoadingAuth";
import RegistrationForm from "@/app/components/RegistrationForm";
import { getFriendlyErrorMessage } from "@/app/utils/firebaseErrorMessages";

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [createUserWithEmailAndPassword, user, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSignup = async (e, { email, password, displayName, avatar }) => {
    e.preventDefault();

    const userCredential = await createUserWithEmailAndPassword(
      email,
      password
    );

    const firebaseUser = userCredential.user;

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

    let avatarUrl = null;
    if (avatar) {
      avatarUrl = await uploadImageToCloudinary(avatar);
    }

    await updateProfile(firebaseUser, {
      displayName,
      photoURL: avatarUrl,
    });

    const redirectPath = searchParams.get("redirect") || "/";
    router.push(redirectPath);
  };

  const friendlyError = authError
    ? getFriendlyErrorMessage(authError.code)
    : null;

  if (loading) {
    return <LoadingAuth />;
  }

  return (
    <main>
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
    </main>
  );
}
