"use client";

import { auth } from "@/lib/firebaseClient";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";

import LoadingAuth from "@/app/components/LoadingAuth";
import LoginForm from "@/app/components/LoginForm";
import { getFriendlyErrorMessage } from "@/app/utils/firebaseErrorMessages";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signInWithEmailAndPassword, user, loading, authError] =
    useSignInWithEmailAndPassword(auth);

  const handleLogin = async (e, { email, password }) => {
    e.preventDefault();
    const userCredential = await signInWithEmailAndPassword(email, password);
    if (userCredential) {
      const token = await userCredential.user.getIdToken();
      setCookie("auth-token", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: "strict",
      });
      const redirectPath = searchParams.get("redirect") || "/";
      router.push(redirectPath);
    }
  };

  const friendlyError = authError
    ? getFriendlyErrorMessage(authError.code)
    : null;

  if (loading) {
    return <LoadingAuth />;
  }

  return (
    <main>
      <LoginForm handleSubmit={handleLogin} error={friendlyError} />
    </main>
  );
}
