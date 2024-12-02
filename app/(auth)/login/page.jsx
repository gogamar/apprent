"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../../lib/firebaseClient";
import LoginForm from "../LoginForm";
import Error from "@/app/components/Error";

import { setCookie } from "cookies-next";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();
  const handleLogin = async (e, email, password) => {
    e.preventDefault();
    setError("");
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      // Use setCookie to store the token
      setCookie("firebaseAuthToken", token, {
        path: "/", // Make the cookie available across the entire app
        maxAge: 60 * 60 * 24 * 7, // Optional: Set expiry time (7 days here)
        secure: true, // Ensure cookies are sent over HTTPS
        sameSite: "strict", // Protect against CSRF
      });
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main>
      <LoginForm handleSubmit={handleLogin} error={error} />
    </main>
  );
}
