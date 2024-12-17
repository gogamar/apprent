import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import PropertyIndex from "@/app/components/PropertyIndex";

const checkIfAdmin = async (uid) => {
  try {
    const adminDoc = await adminDb.collection("roles").doc("admin").get();
    if (adminDoc.exists) {
      const adminData = adminDoc.data();
      return adminData.uid === uid;
    }
    return false;
  } catch (error) {
    console.error("Error checking admin role:", error.message);
    return false;
  }
};

export default async function Properties() {
  // Get the cookies store asynchronously
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return <div>You must be logged in to view this page.</div>;
  }

  try {
    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid } = decodedToken;

    // Check if the user is an admin
    const isAdmin = await checkIfAdmin(uid);

    // Query Firestore based on the user's role
    let propertiesRef = adminDb.collection("properties");
    if (!isAdmin) {
      propertiesRef = propertiesRef.where("userId", "==", uid);
    }

    const snapshot = await propertiesRef.get();

    if (snapshot.empty) {
      return <PropertyIndex initialProperties={[]} />;
    }

    const properties = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || null,
        updatedAt: data.updatedAt?.toDate().toISOString() || null,
      };
    });

    return <PropertyIndex initialProperties={properties} />;
  } catch (error) {
    console.error(
      "Error verifying token or querying Firestore:",
      error.message
    );
    return <div>Error loading properties. Please try again later.</div>;
  }
}
