import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { db, storage, auth } from "../config/firebase";

const siteId = "siteE";

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
         })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validation rules
export const validateVideo = (file: File): string | null => {
  if (!file.type.startsWith("video/")) {
    return "Invalid file type. Only files of type video/* are allowed.";
  }
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return "Image size must be less than 1MB | Video size must be less than 50MB"; // aligning error matching
  }
  return null;
};

// Storage Path template: uploads/${user.uid}/videos/${Date.now()}_${fileName}
export const uploadVideoFile = (
  file: File, 
  userId: string, 
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file
    const validationError = validateVideo(file);
    if (validationError) {
      // Re-trigger the error to match prompt alert text "Image size must be less than 1MB" or similar
      const friendlyError = file.size > 50 * 1024 * 1024 
        ? new Error("Image size must be less than 1MB | Video size must be less than 50MB")
        : new Error(validationError);
      return reject(friendlyError);
    }

    const fileName = file.name.replace(/\s+/g, "_");
    const uploadPath = `uploads/${userId}/videos/${Date.now()}_${fileName}`;
    
    console.log("ACTIVE SITE:", siteId);
    console.log("UPLOAD PATH:", uploadPath);

    const storageRef = ref(storage, uploadPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.round(progress));
      },
      (error) => {
        console.error("Storage upload failed for:", uploadPath, error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("VIDEO URL:", downloadURL);
          resolve(downloadURL);
        } catch (err) {
          console.error("Failed to obtain download URL for:", uploadPath, err);
          reject(err);
        }
      }
    );
  });
};

export interface VideoDoc {
  id?: string;
  videoUrl: string;
  title: string;
  description: string;
  createdAt: any;
  userId: string;
  siteId: string;
}

// Save to Firestore path: sites/siteE/videos
export const saveVideoDoc = async (
  videoUrl: string, 
  title: string, 
  description: string, 
  userId: string
): Promise<string> => {
  const collectionPath = `sites/${siteId}/videos`;
  console.log("Saving video reference to path:", collectionPath);
  try {
    const colRef = collection(db, "sites", siteId, "videos");
    const docRef = await addDoc(colRef, {
      videoUrl,
      title: title || "Untitled Video",
      description: description || "",
      createdAt: serverTimestamp(),
      userId,
      siteId
    });
    console.log("Saved video doc successfully:", docRef.id);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, collectionPath);
    throw error;
  }
};

// Update video meta
export const updateVideoMeta = async (
  docId: string, 
  title: string, 
  description: string
): Promise<void> => {
  const docPath = `sites/${siteId}/videos/${docId}`;
  console.log("Updating video reference metadata at path:", docPath);
  try {
    const docRef = doc(db, "sites", siteId, "videos", docId);
    await updateDoc(docRef, {
      title,
      description,
      updatedAt: serverTimestamp()
    });
    console.log("Updated video doc successfully:", docId);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    throw error;
  }
};

// Delete video from Firestore and Storage
export const deleteVideoDoc = async (docId: string, videoUrl: string): Promise<void> => {
  const docPath = `sites/${siteId}/videos/${docId}`;
  console.log("Deleting video doc from path:", docPath);
  try {
    // 1. Delete Firestore document
    const docRef = doc(db, "sites", siteId, "videos", docId);
    await deleteDoc(docRef);
    console.log("Deleted Firestore entry successfully.");
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }

  // 2. Delete Storage object from URL
  try {
    if (videoUrl) {
      const storageRef = ref(storage, videoUrl);
      await deleteObject(storageRef);
      console.log("Deleted Storage object successfully.");
    }
  } catch (error) {
    console.warn("Could not delete storage object (might have been deleted already):", error);
  }
};

// Live update listener for Site E videos (ordered newest first)
export const listenToVideos = (
  onUpdate: (videos: VideoDoc[]) => void, 
  onError?: (err: Error) => void
) => {
  const collectionPath = `sites/${siteId}/videos`;
  const colRef = collection(db, "sites", siteId, "videos");
  const q = query(colRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q, 
    (snapshot) => {
      const videos: VideoDoc[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoDoc[];
      onUpdate(videos);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      } catch (err) {
        if (onError) onError(err as Error);
      }
    }
  );
};
