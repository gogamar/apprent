import { app } from "@/lib/firebaseClient";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

export const updateProperty = async (id, updatedProperty) => {
  try {
    const db = getFirestore(app);

    const propertyRef = doc(db, "properties", id);
    await updateDoc(propertyRef, updatedProperty);

    console.log("Property updated successfully.");
  } catch (err) {
    console.error("Failed to update property:", err);
    throw err; // Re-throw the error to handle it in the calling function
  }
};
