"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../../../lib/firebaseClient";
import LoginForm from "../LoginForm";
import Error from "@/app/components/Error";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();
    setError("");

    const auth = getAuth(app);

    try {
      // Sign in the user using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err) {
      // Capture and display any errors during the login process
      setError(err.message);
    }
  };

  return (
    <main>
      <LoginForm handleSubmit={handleSubmit} error={error} />
    </main>
  );
}
