import { db, auth } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

const checkIfAdmin = async (uid) => {
  try {
    const adminDoc = await db.collection("roles").doc("admin").get();
    if (adminDoc.exists) {
      const adminData = adminDoc.data();
      return adminData.uid === uid; // Check if the UID matches the admin UID
    }
    return false;
  } catch (error) {
    console.error("Error checking admin role:", error.message);
    return false;
  }
};

const getProperties = async (userId, isAdmin, isPublic = false) => {
  try {
    let query = db.collection("properties");

    // Fetch all properties for public access or admin users
    if (!isPublic && !isAdmin) {
      query = query.where("userId", "==", userId);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      return [];
    }

    const properties = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error.message);
    throw new Error("Failed to fetch properties");
  }
};

export async function GET(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    let userId = null;
    let isAdmin = false;
    let isPublic = false;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      isPublic = true; // No token, so treat as a public request
    } else {
      const idToken = authHeader.split("Bearer ")[1];
      if (!idToken) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Token missing." },
          { status: 401 }
        );
      }

      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        userId = decodedToken.uid; // Extract userId from the token
        isAdmin = await checkIfAdmin(userId); // Check admin role in Firestore
      } catch (error) {
        console.error("Error verifying token:", error.message);
        return NextResponse.json(
          { error: "Unauthorized or invalid token" },
          { status: 403 }
        );
      }
    }

    // Fetch properties based on access level
    const properties = await getProperties(userId, isAdmin, isPublic);
    return NextResponse.json(properties, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
