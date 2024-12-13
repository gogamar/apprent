"use client";

import { auth } from "@/lib/firebaseClient";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthCookie } from "@/app/utils/cookies";

import LoginForm from "@/app/components/LoginForm";
import LoadingAuth from "@/app/components/LoadingAuth";
import { getFriendlyErrorMessage } from "@/app/utils/firebaseErrorMessages";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signInWithEmailAndPassword, user, loading, authError] =
    useSignInWithEmailAndPassword(auth);

  const handleLogin = async (e, { email, password }) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      if (userCredential) {
        const token = await userCredential.user.getIdToken();
        setAuthCookie(token);
        const redirectPath =
          searchParams.get("redirect") || "/account/properties";
        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) {
    return <LoadingAuth />;
  }

  const friendlyError = authError
    ? getFriendlyErrorMessage(authError.code)
    : null;

  return <LoginForm handleSubmit={handleLogin} error={friendlyError} />;
}
