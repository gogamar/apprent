"use client";

import { useRouter } from "next/navigation";
// import { getAuth, signOut } from "firebase/auth";
// import { app } from "../../lib/firebaseClient";

import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseClient";

export default function LogoutButton({ classes }) {
  const router = useRouter();

  const [signOut, loading, error] = useSignOut(auth);

  const handleLogout = () => {
    signOut();
  };

  if (loading) {
    return <div>Signing out...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // const handleLogout = async () => {
  //   const auth = getAuth(app);

  //   try {
  //     await signOut(auth);
  //     router.push("/login");
  //   } catch (error) {
  //     console.error("Error logging out:", error.message);
  //   }
  // };

  return (
    <button className={classes} onClick={handleLogout}>
      Logout
    </button>
  );
}
