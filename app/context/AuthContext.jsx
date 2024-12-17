"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { setCookie, deleteCookie } from "cookies-next";
import { auth } from "@/lib/firebaseClient";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserRole = async (currentUser) => {
      try {
        const db = getFirestore();

        // Force token refresh
        const idToken = await currentUser.getIdToken(true);
        setCookie("authToken", idToken, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600, // Token expiration: 1 hour
        });

        // Decode the token
        const decodedToken = jwtDecode(idToken);

        // Fetch the role from Firestore or fallback to custom claims
        const adminDocRef = doc(db, "roles", "admin");
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists() && adminDoc.data().uid === currentUser.uid) {
          setRole("admin");
        } else {
          setRole(decodedToken.role || "user"); // Fallback role
        }
      } catch (err) {
        console.error("Error fetching role or refreshing token:", err);
        setRole(null);
        deleteCookie("authToken");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        await fetchUserRole(currentUser);
      } else {
        setUser(null);
        setRole(null);
        deleteCookie("authToken");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
