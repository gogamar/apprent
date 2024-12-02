import { db, auth } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("firebaseAuthToken")?.value;

  if (!token) {
    redirect("/"); // Redirect to home if no token
    return null; // Prevent further rendering
  }

  let decodedToken = null;
  try {
    // Verify the token using Firebase Admin SDK
    decodedToken = await auth.verifyIdToken(token);
  } catch (err) {
    console.error("Error verifying token:", err);
    redirect("/"); // Redirect to home on error
    return null; // Prevent further rendering
  }

  const userId = decodedToken.uid;

  // Check if the user is an admin
  const roleDoc = await db.collection("roles").doc("admin").get();
  const isAdmin = roleDoc.exists && roleDoc.data().uid === userId;

  if (!isAdmin) {
    redirect("/"); // Redirect to home if not an admin
    return null; // Prevent further rendering
  }

  return (
    <div>
      {children} {/* Render the child routes (dashboard, all-properties) */}
    </div>
  );
}
