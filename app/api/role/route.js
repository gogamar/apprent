import { auth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    const { uid, role = "user" } = await req.json();

    // Validate the role if it is provided
    if (!["user", "manager"].includes(role)) {
      return new Response(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
      });
    }

    // Set custom claims for the user
    await auth.setCustomUserClaims(uid, { role });

    return new Response(
      JSON.stringify({ message: `Role assigned/updated to ${role}.` }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning/updating user role:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
