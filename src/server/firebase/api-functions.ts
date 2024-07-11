import {
  firebaseStorage,
  storage,
} from "../../client-functions/client-firebase";

export const serverUploadToFirebase = async (
  file: any,
  path: string,
  fileType: string,
  getUrl?: boolean,
) => {
  const fileRef = firebaseStorage.ref(storage, path);
  const metadata = { contentType: fileType };
  if (file) await firebaseStorage.uploadBytes(fileRef, file, metadata);
  if (getUrl === true) return await firebaseStorage.getDownloadURL(fileRef);
};

export async function serverFirebaseDownloadLink(path: string) {
  const fileRef = firebaseStorage.ref(storage, path);
  return await firebaseStorage.getDownloadURL(fileRef);
}
