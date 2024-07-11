import type { UploadResult, Uppy, UppyFile } from "@uppy/core";
import { create } from "zustand";
import type { FileUploadPathData } from "@/src/types/storage.types";
import { maxFileSizes } from "@/src/utils/utils";

interface FileDrop {
  openModal: boolean;
  setOpenModal: (data: boolean) => void;

  uppy: Uppy<Record<string, unknown>, Record<string, unknown>> | undefined;
  setUppy: (
    data: Uppy<Record<string, unknown>, Record<string, unknown>> | undefined,
  ) => void;

  uploaderData: UploaderData;
  setUploaderData: (data: UploaderData) => void;

  initModal: (data: UploaderData) => void;

  fileLength: number;
  setFileLength: (data: number) => void;

  uploadingFiles: { file: UppyFile; progress: number }[];
  setUploadingFiles: (data: { file: UppyFile; progress: number }[]) => void;
}
type UploaderDataBase = {
  sizeUpdater?: (result: UploadResult) => void;
  maxFileSize?: number;
  title?: string;
  description?: string;
  allowedFileTypes?: string[];
  autoProceed?: boolean;
  uploadPathData: FileUploadPathData;
  showUploadButton?: boolean;
};

type UploaderDataSingleFile = UploaderDataBase & {
  maxFileAmount?: 1;
  minFileAmount?: 1;
  onUploadFinish?: (result: UploadResult) => void;
  onUploadCompleted?: (url: string) => void;
};

type UploaderDataMultipleFiles = UploaderDataBase & {
  maxFileAmount?: number;
  minFileAmount?: number;
  onUploadFinish?: (result: UploadResult) => void;
  onUploadCompleted?: (urls: string[]) => void;
};

export type UploaderData = UploaderDataSingleFile | UploaderDataMultipleFiles;
const initalState = {
  uppy: undefined,
  openModal: false,
  fileLength: 0,
  uploadingFiles: [],
  uploaderData: {
    onUploadFinish: undefined,
    onUploadCompleted: () => {
      alert("Can't complete Upload");
    },
    sizeUpdater: undefined,
    title: "file_drop_over_and_modal_title",
    description: "file_drop_over_and_modal_description",
    maxFileAmount: 1,
    maxFileSize: maxFileSizes.fallback,
    allowedFileTypes: undefined,
    minFileAmount: 1,
    autoProceed: false,
    uploadPathData: {
      type: undefined,
    },
  },
};

const setters = (set) => ({
  ...initalState,
  reset: () => set(() => ({ ...initalState })),
  setUppy: (data) => set(() => ({ uppy: data })),
  setUploaderData: (data) => set(() => ({ uploaderData: data })),
  setOpenModal: (data) => set(() => ({ openModal: data })),
  initModal: (data) =>
    set(() => ({ uploaderData: { ...data }, openModal: true })),
  setFileLength: (data) => set(() => ({ fileLength: data })),
  setUploadingFiles: (data) => set(() => ({ uploadingFiles: data })),
});
const useFileDrop = create<FileDrop>()(setters);

export default useFileDrop;

export const useCourseDriveUploader = create<FileDrop>(setters);
