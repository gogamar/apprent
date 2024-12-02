"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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
        const idToken = await currentUser.getIdToken(true); // Force refresh token
        const decodedToken = jwtDecode(idToken);

        // Fetch the role from Firestore or fallback to the token role
        const adminDocRef = doc(db, "roles", "admin");
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists() && adminDoc.data().uid === currentUser.uid) {
          setRole("admin");
        } else {
          setRole(decodedToken.role || "No role");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setRole(null);
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
