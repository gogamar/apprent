import { NextResponse } from "next/server";
import { scrapeData } from "@/app/utils/scraper";
import { addOrUpdateBookingProperties } from "@/app/utils/saveBookingProperty";
import { auth } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: No token provided." },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Token missing." },
        { status: 401 }
      );
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const body = await request.json();
    const { link, affiliateId } = body;

    if (!link || typeof link !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing link." },
        { status: 400 }
      );
    }

    if (!affiliateId || typeof affiliateId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing affiliate id." },
        { status: 400 }
      );
    }

    let properties = [];
    try {
      properties = await scrapeData(link, affiliateId);
      if (!properties || properties.length === 0) {
        return NextResponse.json(
          { success: false, error: "No properties found to scrape." },
          { status: 404 }
        );
      }
    } catch (err) {
      console.error("Error scraping data:", err);
      return NextResponse.json(
        { success: false, error: "Failed to scrape data." },
        { status: 500 }
      );
    }

    try {
      // Save all properties in a batch
      const savedCount = await addOrUpdateBookingProperties(
        properties.map((property) => ({
          ...property,
          published: true,
          featured: false,
          userId,
        }))
      );

      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const response = await fetch(`${baseUrl}/api/filter`, { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to refresh cache of filter.");
      }
    } catch (err) {
      console.error("Error saving properties:", err);
      return NextResponse.json(
        { success: false, error: "Failed to save properties." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
