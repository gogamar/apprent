"use client";

import { auth } from "@/lib/firebaseClient";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

import LoginForm from "../LoginForm";

export default function Login() {
  const router = useRouter();
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [formError, setFormError] = useState("");

  const handleLogin = async (email, password) => {
    setFormError(""); // Reset error state
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      if (userCredential) {
        const token = await userCredential.user.getIdToken();
        // Use setCookie to store the token
        setCookie("firebaseAuthToken", token, {
          path: "/", // Make the cookie available across the entire app
          maxAge: 60 * 60 * 24 * 7, // Optional: Set expiry time (7 days here)
          secure: true, // Ensure cookies are sent over HTTPS
          sameSite: "strict", // Protect against CSRF
        });
        router.push("/");
      }
    } catch (err) {
      setFormError(err.message || "An error occurred during login.");
    }
  };

  if (loading) {
    return <div>Signing in...</div>;
  }

  return (
    <main>
      {formError && <div className="error">{formError}</div>}
      <LoginForm handleSubmit={handleLogin} error={error} />
    </main>
  );
}
