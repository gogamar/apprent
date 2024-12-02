import { NextResponse } from "next/server";
import { scrapeData } from "@/app/utils/scraper";
import { addOrUpdateBookingProperty } from "@/app/utils/saveBookingProperty";
import { auth } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    // Extract and verify Authorization header
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

    // Decode and verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Extract the link from the request body
    const body = await request.json();
    const { link } = body;

    if (!link || typeof link !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid or missing link." },
        { status: 400 }
      );
    }

    // Scrape data using the provided link
    const properties = await scrapeData(link);
    if (!properties || properties.length === 0) {
      return NextResponse.json(
        { success: false, error: "No properties found to scrape." },
        { status: 404 }
      );
    }

    // Process properties concurrently
    const savedProperties = await Promise.all(
      properties.map(async (property) => {
        const {
          baseUrl,
          srpvid,
          companyName,
          mainImageUrl,
          location,
          title,
          details,
          score,
          address,
          latitude,
          longitude,
        } = property;

        // Validate required fields
        if (!srpvid) {
          console.warn("Missing srpvid for property:", property);
          return { error: "Missing srpvid", property };
        }

        // Save or update property in the database
        const docId = await addOrUpdateBookingProperty({
          baseUrl,
          srpvid,
          companyName,
          mainImageUrl,
          location,
          title,
          details,
          score,
          address,
          latitude,
          longitude,
          userId,
        });

        const action = docId.startsWith("new_") ? "created" : "updated";

        return { docId, ...property, action };
      })
    );

    return NextResponse.json({
      success: true,
      message: "Data saved successfully.",
      properties: savedProperties.filter((prop) => !prop.error), // Filter out errors
      errors: savedProperties.filter((prop) => prop.error), // Collect errors
    });
  } catch (error) {
    console.error("Error saving scraped data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
