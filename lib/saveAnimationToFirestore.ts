import { db } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function saveAnimationToFirestore(uid: string, imageUrl: string, title: string) {
  try {
    const docRef = await addDoc(collection(db, "animations"), {
      uid,
      imageUrl,
      title,
      createdAt: serverTimestamp(),
    })
    console.log("Document written with ID: ", docRef.id)
  } catch (e) {
    console.error("Error adding document: ", e)
  }
}