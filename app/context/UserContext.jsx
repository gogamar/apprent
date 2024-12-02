"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";

// Create the context
const UserContext = createContext({
  user: null,
  role: null,
  loading: true,
});

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    // Subscribe to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true); // Set loading to true while fetching data

      if (currentUser) {
        try {
          // Refresh user state to ensure latest profile updates are fetched
          await currentUser.reload();
          const refreshedUser = auth.currentUser;

          // Get ID token and decode role
          const idToken = await refreshedUser.getIdToken(true); // Force token refresh
          const decodedToken = jwtDecode(idToken);

          setUser(refreshedUser);

          // Fetch the admin document from Firestore
          const adminDocRef = doc(db, "roles", "admin");
          const adminDoc = await getDoc(adminDocRef);

          if (adminDoc.exists() && adminDoc.data().uid === refreshedUser.uid) {
            setRole("admin"); // Set role to "admin" if the UID matches
          } else {
            setRole(decodedToken.role || "No role"); // Default to token role
          }
        } catch (error) {
          console.error("Error fetching admin role:", error);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }

      setLoading(false); // Done loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, role, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
