"use client";

import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import { deleteCookie } from "cookies-next";
import { auth } from "@/lib/firebaseClient";

export default function LogoutButton({ classes }) {
  const router = useRouter();
  const [signOut] = useSignOut(auth);

  const handleLogout = async () => {
    await signOut();
    deleteCookie("auth-token", { path: "/" });
    router.push("/");
  };

  return (
    <a className={classes} onClick={handleLogout}>
      Logout
    </a>
  );
}
