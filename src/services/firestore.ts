import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  setDoc,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../config/firebase";
import { siteConfig } from "../config/siteConfig";

const SITE_COLLECTION = "sites";

export const getSiteCollection = (collectionName: string) => {
  return collection(db, SITE_COLLECTION, siteConfig.siteId, collectionName);
};

export const getSiteDoc = (collectionName: string, docId: string) => {
  return doc(db, SITE_COLLECTION, siteConfig.siteId, collectionName, docId);
};

export const fetchData = async (collectionName: string, sortField = "position", order: "asc" | "desc" = "asc") => {
  const colRef = getSiteCollection(collectionName);
  const q = query(colRef, orderBy(sortField, order));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchDoc = async (collectionName: string, docId: string) => {
  const docRef = getSiteDoc(collectionName, docId);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const addData = async (collectionName: string, data: any) => {
  console.log(`Starting addData to ${collectionName}`, data);
  const colRef = getSiteCollection(collectionName);
  try {
    const res = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`addData success: ${res.id}`);
    return res;
  } catch (err) {
    console.error(`addData error:`, err);
    throw err;
  }
};

export const updateData = async (collectionName: string, docId: string, data: any) => {
  console.log(`Starting updateData to ${collectionName}/${docId}`, data);
  const docRef = getSiteDoc(collectionName, docId);
  try {
    const res = await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`updateData success`);
    return res;
  } catch (err) {
    console.error(`updateData error:`, err);
    throw err;
  }
};

export const deleteData = async (collectionName: string, docId: string) => {
  console.log(`Deleting ${collectionName}/${docId}`);
  const docRef = getSiteDoc(collectionName, docId);
  return await deleteDoc(docRef);
};

export const uploadImage = async (file: File, uid: string) => {
  if (file.size > 1024 * 1024) {
    throw new Error("Image size must be less than 1MB");
  }
  console.log(`Starting upload for ${file.name} to uploads/${uid}`);
  try {
    const storageRef = ref(storage, `uploads/${uid}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    console.log(`Upload success for ${file.name}`);
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    console.error(`Upload error for ${file.name}:`, err);
    throw err;
  }
};

export const deleteImage = async (url: string) => {
  const storageRef = ref(storage, url);
  return await deleteObject(storageRef);
};

// SEO Slug Generator
export const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // change non-English characters to their English equivalent
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w-]+/g, '') // remove all non-word chars
    .replace(/--+/g, '-') // replace multiple - with single -
    .replace(/^-+/, '') // trim - from start of text
    .replace(/-+$/, ''); // trim - from end of text
};

// Comment System Helpers
export const getCommentsCollection = (collectionName: string, docId: string) => {
  return collection(db, SITE_COLLECTION, siteConfig.siteId, collectionName, docId, "comments");
};

export const getRepliesCollection = (commentId: string) => {
  // Since we want replies to a specific comment, we need the full path to that comment
  // But for simplicity in moderation, we might store them differently.
  // The request says: comments/{commentId}/replies/{replyId}
  // This implies commentId is unique enough or we need its parent info.
  // Let's use a flat structure for easier moderation if possible, or strictly follow the requirement.
  // Requirement: sites/{siteId}/{collection}/{docId}/comments/{commentId}/replies/{replyId}
};

// Utils for positioning
export const updatePositions = async (collectionName: string, items: { id: string, position: number }[]) => {
  const promises = items.map(item => 
    updateDoc(getSiteDoc(collectionName, item.id), { position: item.position })
  );
  return Promise.all(promises);
};
