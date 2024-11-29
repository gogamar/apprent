import { db, admin } from "@/lib/firebaseAdmin";

export async function addOrUpdateBookingProperty(propertyData) {
  const { srpvid, ...otherData } = propertyData;

  if (!srpvid) {
    throw new Error("Missing 'srpvid' in property data.");
  }

  const collectionRef = db.collection("properties");

  try {
    // Query for a document with the same srpvid
    const querySnapshot = await collectionRef
      .where("srpvid", "==", srpvid)
      .get();

    if (!querySnapshot.empty) {
      // Document exists, update it
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update({
        ...otherData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id; // Indicate an update
    } else {
      // Document does not exist, create a new one
      const docRef = await collectionRef.add({
        srpvid,
        ...otherData,
        userId: propertyData.userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Add updatedAt on creation
      });
      return docRef.id; // Indicate a creation
    }
  } catch (error) {
    console.error("Error in addOrUpdateBookingProperty:", error);
    throw error;
  }
}
