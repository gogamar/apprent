"use client";

import PropTypes from "prop-types";

import { useRouter } from "next/navigation";
import { useSignOut } from "react-firebase-hooks/auth";
import { deleteCookie } from "cookies-next";
import { auth } from "@/lib/firebaseClient";

export default function LogoutButton({ classes }) {
  const router = useRouter();
  const [signOut] = useSignOut(auth);

  const handleLogout = async () => {
    await signOut();
    deleteCookie("authToken", { path: "/" });
    router.push("/");
  };

  return (
    <button className={classes} onClick={handleLogout}>
      Logout
    </button>
  );
}

LogoutButton.propTypes = {
  classes: PropTypes.string,
};
