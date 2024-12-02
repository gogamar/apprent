import { auth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid, role } = await req.json(); // UID and role sent from the client

    if (!["user", "manager"].includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
      });
    }

    // Update custom claims
    await auth.setCustomUserClaims(uid, { role });

    return new Response(
      JSON.stringify({ message: `Role updated to ${role}.` }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating role:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
