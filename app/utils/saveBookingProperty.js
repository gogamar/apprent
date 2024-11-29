import { db, admin } from "@/lib/firebaseAdmin";

export async function addOrUpdateBookingProperty(propertyData) {
  const { baseUrl, ...otherData } = propertyData;

  const collectionRef = db.collection("properties");

  try {
    // Query for a document with the same baseUrl
    const querySnapshot = await collectionRef
      .where("baseUrl", "==", baseUrl)
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
        baseUrl,
        ...otherData,
        userId: propertyData.userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return docRef.id; // Indicate a creation
    }
  } catch (error) {
    console.error("Error in addOrUpdateBookingProperty:", error);
    throw error;
  }
}
