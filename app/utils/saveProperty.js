import { app } from "@/lib/firebaseClient";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const addProperty = async ({
  websiteUrl,
  imageUrls,
  location,
  title,
  propertyType,
  numberOfRooms,
  numberOfBathrooms,
  numberOfKitchens,
  size,
  userId,
}) => {
  try {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "properties"), {
      websiteUrl,
      imageUrls,
      location,
      title,
      propertyType,
      numberOfRooms,
      numberOfBathrooms,
      numberOfKitchens,
      size,
      userId: userId,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error("Error adding property:", err);
    throw err;
  }
};
