import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const fetchUserData = async (
  id: string
): Promise<{ login: string; avatar: File | null }> => {
  return new Promise(async (res, rej) => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", id));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      res({ login: data.name, avatar: data.avatar });
    } catch (err) {
      rej(err);
    }
  });
};
