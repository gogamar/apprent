import { auth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid } = await req.json(); // UID sent from the client

    // Set custom claims for the user
    await auth.setCustomUserClaims(uid, { role: "user" });

    return new Response(JSON.stringify({ message: "User role assigned." }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error assigning user role:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
