"use client";

import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../lib/firebaseClient";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const auth = getAuth(app);

    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <button className="btn-secondary" onClick={handleLogout}>
      Logout
    </button>
  );
}
