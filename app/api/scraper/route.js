import { NextResponse } from "next/server";
import { scrapeData } from "@/app/utils/scraper";
import { addOrUpdateBookingProperty } from "@/app/utils/saveBookingProperty";
import { admin } from "@/lib/firebaseAdmin";

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

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const properties = await scrapeData();

    // Map each property to a promise
    const propertyPromises = properties.map(async (property) => {
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

      if (!srpvid) {
        console.error("Missing srpvid for property:", property);
        throw new Error("Missing srpvid in property data.");
      }

      const docId = await addOrUpdateBookingProperty({
        baseUrl,
        srpvid, // Ensure srpvid is passed here
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
    });

    // Execute all promises concurrently
    const savedProperties = await Promise.all(propertyPromises);

    return NextResponse.json({
      success: true,
      message: "Data saved successfully.",
      properties: savedProperties,
    });
  } catch (error) {
    console.error("Error saving scraped data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
