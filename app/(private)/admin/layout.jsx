"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { user, role, loading, error } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Authentication error:", error);
    router.push("/");
    return null;
  }

  if (role !== "admin") {
    console.error("Access denied. Only admins can view this page.");
    router.push("/");
    return null;
  }

  return <div>{children}</div>;
}
