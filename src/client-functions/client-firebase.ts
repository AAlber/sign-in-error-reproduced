import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import type { FullMetadata, StorageReference } from "firebase/storage";
import {
  getBlob,
  getBytes,
  getStorage,
  list,
  listAll,
  ref,
} from "firebase/storage";
import * as fbs from "firebase/storage";
import { EMPTY_FILE } from "../components/cloud-overlay/classes/fuxam-drive";
import { toast } from "../components/reusable/toaster/toast";
import useUser from "../zustand/user";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebase = initializeApp(firebaseConfig);
export const auth = getAuth(firebase);
export const storage = getStorage(firebase);
export const firebaseStorage = fbs;
// export const firebaseStorage = await import("firebase/storage");
export default firebase;

export enum FirebaseUploadType {
  User,
  Institution,
  HandIn,
}

export const uploadToFirebase = async (
  file: File,
  path: string,
  fileType: string,
  firebaseRole: FirebaseUploadType,
  getUrl = false,
) => {
  let finalPath;
  const userId = useUser.getState().user.id;
  const institutionId = useUser.getState().user.currentInstitutionId;

  switch (firebaseRole) {
    case FirebaseUploadType.User:
      finalPath = `/users/${userId + path}`;
      break;
    case FirebaseUploadType.Institution:
      finalPath = `/institutions/${institutionId!}/${path}`;
      break;
    case FirebaseUploadType.HandIn:
      finalPath = `/users/${userId}/handin/` + path;
      break;
  }

  try {
    const fileRef = firebaseStorage.ref(storage, finalPath);
    const metadata = { contentType: fileType };
    if (file) await firebaseStorage.uploadBytes(fileRef, file, metadata);
    if (getUrl === true) return await firebaseStorage.getDownloadURL(fileRef);
  } catch (e) {
    //TODO: This edge case needs to be handled better
    toast.error("toast_drive_upload_error", {
      description: (e as Error).message,
    });
    console.log((e as Error).message);
  }
};

export async function getFirebaseDownloadLink(path: string) {
  const userId = useUser.getState().user.id;
  const downloadPath = `/users/${userId + path}`;
  const fileRef = firebaseStorage.ref(storage, downloadPath);
  return await firebaseStorage.getDownloadURL(fileRef);
}

export async function downloadFirebaseFile(pathOrUrl: string, isUrl = false) {
  let fileUrl;
  if (isUrl) {
    fileUrl = pathOrUrl;
  } else {
    fileUrl = await getFirebaseDownloadLink(pathOrUrl);
  }
  const a = document.createElement("a");
  a.style.display = "none";
  a.download = fileUrl;
  a.target = "_blank";
  a.href = fileUrl;
  a.click();
}

export async function loadFilesFromPath(path, nextPageToken?) {
  const userId = useUser.getState().user.id;
  const listPath = `/users/${userId}/Files/${path === undefined ? "" : path}`;
  const listRef = ref(storage, listPath);
  const loadedFiles = await list(listRef, { maxResults: 100 });
  const promises: Promise<any>[] = [];
  loadedFiles &&
    promises.push(
      getItemsWithMetadata(loadedFiles.items, storage),
      getPreviewLinks(loadedFiles.items, storage),
    );
  const [itemsWithMetadata, previewLinks] = await Promise.all(promises);

  if (loadedFiles) {
    const processedFiles = await createDirectoryList(
      loadedFiles.items,
      true,
      userId,
      itemsWithMetadata,
      previewLinks,
    );
    const processedFolders = await createDirectoryList(
      loadedFiles.prefixes,
      false,
      userId,
    );
    const files = [...processedFolders, ...processedFiles];
    if (files.length === 1 && files[0]?.name === EMPTY_FILE) return [];
    else {
      const newFiles = await removeEmptyFile(files, EMPTY_FILE);
      return newFiles;
    }
  }
}

export type DownloadFileType = {
  id: string;
  name: string;
  size: string;
  lastModified?: string;
  source?: string;
  viewLink?: string;
  type: string;
};

export async function deleteFirebaseFileOrFolder(path) {
  const userId = useUser.getState().user.id;
  const deletePath = `/users/${userId}` + path;
  const fileRef = firebaseStorage.ref(storage, deletePath);
  if (deletePath.endsWith("/")) {
    return await deleteFolder(fileRef);
  } else {
    return await firebaseStorage.deleteObject(fileRef);
  }
}

export async function getFileBlob(path: string) {
  const file = ref(storage, path);
  const blob = await getBlob(file);
  return blob;
}

export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export const signIntoFirebase = async (getToken) => {
  const token = await getToken({ template: "integration_firebase" });
  if (!token) {
    throw new Error("No token found");
  }
  const userCredentials = await signInWithCustomToken(auth, token);
};

export const filterId = (files: DownloadFileType[], id) => {
  return files.filter((file) => file.id !== id);
};

export const removeEmptyFile = async (
  files: DownloadFileType[],
  EMPTY_FILE,
) => {
  let filesCopy = [...files];
  for (const file of filesCopy) {
    if (file.name === EMPTY_FILE) {
      filesCopy = filterId(files, file.id);
    }
  }
  return filesCopy;
};

export const getItemsWithMetadata = async (
  items: StorageReference[],
  storage,
) => {
  const promises: Promise<any>[] = [];
  items.forEach((item) => {
    const ref = firebaseStorage.ref(storage, item.fullPath);
    promises.push(firebaseStorage.getMetadata(ref));
  });
  return await Promise.all(promises);
};
export const getPreviewLinks = async (items: StorageReference[], storage) => {
  const promises: Promise<any>[] = [];
  items.forEach((item) => {
    const ref = firebaseStorage.ref(storage, "/" + item.fullPath);
    promises.push(firebaseStorage.getDownloadURL(ref));
  });
  return await Promise.all(promises);
};

export const createDirectoryList = async (
  itemsOrPrefixes: StorageReference[],
  isItem,
  userId,
  itemsWithMetadata?,
  previewLinks?,
) => {
  const files: DownloadFileType[] = [];
  for (let i = 0; i < itemsOrPrefixes.length; i++) {
    const itemOrPrefix = itemsOrPrefixes[i];
    if (itemOrPrefix) {
      const id = itemOrPrefix.fullPath.replace(`/users/${userId}/Files/`, "");
      files.push(
        isItem
          ? {
              id: id,
              name: itemOrPrefix.name,
              // type: fileTypes(itemsWithMetadata[i].contentType),
              size: itemsWithMetadata[i].size,
              type: itemsWithMetadata[i].contentType,
              lastModified: itemsWithMetadata[i].updated.split("T")[0],
              viewLink: previewLinks[i],
            }
          : {
              id: id,
              name: itemOrPrefix.fullPath.split("/").pop()!,
              // type: "folder",
              type: "folder",
              size: "",
              lastModified: "",
            },
      );
    }
  }
  return files;
};

const deleteFolder = async (folderRef) => {
  // List the children of the folder
  const objectsAtPath = await listAll(folderRef);
  // Delete all the files and subfolders in the folder
  const promises: Promise<any>[] = [];

  for (const item of objectsAtPath.items) {
    const itemRef = firebaseStorage.ref(folderRef.storage, item.fullPath);
    // If the item is a file, delete it
    promises.push(firebaseStorage.deleteObject(itemRef));
  }
  for (const prefix of objectsAtPath.prefixes) {
    const itemRef = firebaseStorage.ref(folderRef.storage, prefix.fullPath);
    promises.push(deleteFolder(itemRef));
  }
  return await Promise.all(promises);
};

export const fileTypes = (type: any) => {
  if (type.includes("image")) return type;
  if (type.includes("audio")) return "audio";
  if (type.includes("video")) return "video";
  if (type.includes("zip") && !type.includes("epub")) return "zip";
  if (type.includes("csv")) return "excel";
  if (type === "scribble" || type === "task") return type;
  switch (type) {
    case "application/epub+zip":
      return "e-book";
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "ppt";
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    case "application/msword":
      return "word";
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "excel";
    case "application/pdf":
      return "pdf";
    default:
      return "text";
  }
};

export const renameFirebaseFileOrFolder = async ({
  originalPath,
  newEnding,
  userId,
}: {
  originalPath: string;
  newEnding: string;
  userId: string;
}) => {
  const path = `/users/${userId}/Files/${originalPath}`;
  const fileRef = firebaseStorage.ref(storage, path);

  if (path.endsWith("/")) {
    return await renameFolder(fileRef, originalPath, newEnding, userId);
  } else {
    return await renameFile(fileRef, originalPath, newEnding, userId);
  }
};

// Define a function to delete a folder and all its children recursively
const renameFolder = async (folderRef, originalPath, newEnding, userId) => {
  // List the children of the folder
  const objectsAtPath = await listAll(folderRef);
  //Rename all the files and subfolders in the folder
  const promises: Promise<any>[] = [];
  for (const item of objectsAtPath.items) {
    const itemRef = firebaseStorage.ref(folderRef.storage, item.fullPath);
    // If the item is a file, rename it
    promises.push(renameFile(itemRef, originalPath, newEnding, userId));
  }
  for (const prefix of objectsAtPath.prefixes) {
    const ref = firebaseStorage.ref(folderRef.storage, prefix.fullPath);
    promises.push(renameFolder(ref, originalPath, newEnding, userId));
  }
  return await Promise.all(promises);
};

const renameFile = async (fileRef, originalPath, newEnding, userId) => {
  const promises: Promise<ArrayBuffer | FullMetadata>[] = [];
  promises.push(getBytes(fileRef), firebaseStorage.getMetadata(fileRef));
  const [arrayBuffer, objMetadata] = await Promise.all(promises);
  const metadata = { contentType: (objMetadata as FullMetadata)?.contentType };
  const path = `users/${userId}/Files/${originalPath}`;
  const objectToRename = arrayBuffer as ArrayBuffer;

  if (originalPath.endsWith("/")) {
    let newPath = path.slice(0, -1);
    newPath = replaceLastWord(newPath, newEnding);
    const newfilePath =
      fileRef.fullPath.replace(path.slice(0, -1), newPath) + "/";
    const newRef = firebaseStorage.ref(storage, newfilePath);
    const uploadRes = await firebaseStorage.uploadBytes(
      newRef,
      objectToRename,
      metadata,
    );
    const deleteRes = await firebaseStorage.deleteObject(fileRef);
    return { uploadRes, deleteRes };
  } else {
    const newPath = replaceLastWord(path, newEnding);
    const newRef = firebaseStorage.ref(storage, newPath);
    const deleteRes = await firebaseStorage.deleteObject(fileRef);
    const uploadRes = await firebaseStorage.uploadBytes(
      newRef,
      objectToRename,
      metadata,
    );
    return { uploadRes, deleteRes };
  }
};

function replaceLastWord(str: string, newWord: string): string {
  return str.replace(/[^/]+$/, newWord);
}

export function getSubpath(fullPath: string, searchString: string): string {
  const pathElements = fullPath.split("/");
  let result = "";

  for (let i = 0; i < pathElements.length; i++) {
    result += pathElements[i] + "/";
    if (pathElements[i] === searchString) {
      break;
    }
  }
  return result;
}

export function isNotInLastFour(arr: string[], item) {
  const lastIndex = arr.length - 1;
  for (let i = lastIndex; i > lastIndex - 4 && i >= 0; i--) {
    if (arr[i] === item) {
      return false;
    }
  }
  return true;
}
