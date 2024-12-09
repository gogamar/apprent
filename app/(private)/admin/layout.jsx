"use client";

import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { user, role, loading, error } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return <p>Loading...</p>; // Show a loading state while user information is being fetched
  }

  if (error) {
    console.error("Authentication error:", error);
    router.push("/"); // Redirect to the home page on error
    return null; // Prevent further rendering
  }

  if (role !== "admin") {
    console.error("Access denied. Only admins can view this page.");
    router.push("/"); // Redirect non-admin users
    return null; // Prevent further rendering
  }

  return (
    <div>
      {children} {/* Render the child routes (dashboard, all-properties) */}
    </div>
  );
}
