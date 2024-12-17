import { adminDb, admin } from "@/lib/firebaseAdmin";

export async function addOrUpdateBookingProperties(properties) {
  if (!Array.isArray(properties) || properties.length === 0) {
    throw new Error("No properties provided for batch processing.");
  }

  const collectionRef = adminDb.collection("properties");
  const batch = adminDb.batch();

  try {
    for (const propertyData of properties) {
      const { srpvid, detailUrl, ...otherData } = propertyData;

      if (!srpvid) {
        console.error("Skipping property with missing 'srpvid':", propertyData);
        continue;
      }

      // Query for a document with the same srpvid
      const querySnapshot = await collectionRef
        .where("srpvid", "==", srpvid)
        .get();

      if (!querySnapshot.empty) {
        // Document exists, update it
        const docRef = querySnapshot.docs[0].ref;
        batch.update(docRef, {
          ...otherData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Document does not exist, create a new one
        const docRef = collectionRef.doc(); // Generate a new document ID
        batch.set(docRef, {
          srpvid,
          ...otherData,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    await batch.commit();
  } catch (error) {
    console.error("Error in addOrUpdateBookingProperties:", error);
    throw error;
  }
}
