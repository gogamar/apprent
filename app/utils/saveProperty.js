import { app } from "@/lib/firebaseClient";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const saveProperty = async (property) => {
  try {
    const db = getFirestore(app);

    // Add the property to Firestore with additional fields
    const docRef = await addDoc(collection(db, "properties"), {
      ...property,
      published: property.published ?? true,
      featured: property.featured ?? false,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error("Error adding property:", err);
    throw err;
  }
};
