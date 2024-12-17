"use client";

import PropTypes from "prop-types";

import { useAuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { role, loading, error } = useAuthContext();
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

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
