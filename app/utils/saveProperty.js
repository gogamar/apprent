import { app } from "@/lib/firebaseClient";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export const addProperty = async ({
  siteUrl,
  mainImageUrl,
  title,
  location,
  propertyType,
  bedrooms,
  livingRooms,
  bathrooms,
  kitchens,
  size,
  highlights,
  address,
  latitude,
  longitude,
  companyName,
  userId: userId,
}) => {
  try {
    const db = getFirestore(app);
    const docRef = await addDoc(collection(db, "properties"), {
      siteUrl,
      mainImageUrl,
      title,
      location,
      propertyType,
      bedrooms,
      livingRooms,
      bathrooms,
      kitchens,
      size,
      highlights,
      views,
      address,
      latitude,
      longitude,
      userId: userId,
      companyName,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (err) {
    console.error("Error adding property:", err);
    throw err;
  }
};
