import cuid from "cuid";
import { create } from "zustand";
import { initializeBlockUploader } from "@/src/client-functions/client-cloudflare/uppy-logic";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlockSpecsMapping } from "@/src/types/content-block/types/specs.types";

interface ContentBlockModalState {
  id: string;
  isOpen: boolean;
  loading: boolean;
  contentBlockType: keyof ContentBlockSpecsMapping | null;
  name: string;
  description: string;
  data: ContentBlockSpecsMapping[keyof ContentBlockSpecsMapping] | null;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setOpen: (isOpen: boolean) => void;
  openModal: (type: keyof ContentBlockSpecsMapping) => void;
  closeModal: () => void;
  setError: (error: string | null) => void;
  setName: (name: string) => void;
  setDescription: (name: string) => void;
  setData: <T extends keyof ContentBlockSpecsMapping>(
    data: T extends keyof ContentBlockSpecsMapping
      ? ContentBlockSpecsMapping[T]
      : never,
  ) => void;
  startDate?: Date | null;
  setStartDate: (date: Date | null) => void;
  dueDate?: Date | null;
  setDueDate: (date: Date | null) => void;
}

const useContentBlockModal = create<ContentBlockModalState>((set, get) => ({
  isOpen: false,
  loading: false,
  name: "",
  description: "",
  contentBlockType: null,
  error: null,
  data: null,
  id: cuid(),

  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setLoading: (loading) => set({ loading }),
  setOpen: (isOpen) => {
    if (!isOpen) set({ id: cuid() });
    set({ isOpen });
  },
  setError: (error) => set({ error }),
  openModal: (type) => {
    const block = contentBlockHandler.get.registeredContentBlockByType(type);

    const defaultValues = {};
    if (block.form) {
      Object.entries(block.form).forEach(([key, field]) => {
        if (field === null) return;
        if (field.fieldType === "file" || field.fieldType === "custom") return;

        defaultValues[key] =
          field.hasOwnProperty("defaultValue") && field.fieldType !== "hidden"
            ? field.defaultValue
            : "";
      });
    }
    initializeBlockUploader(get().id, block);
    set({
      isOpen: true,
      contentBlockType: type,
      data: defaultValues,
      id: get().id,
    });
  },
  closeModal: () => set({ isOpen: false, contentBlockType: null, data: null }),
  setData: (data) => set({ data }),
  setStartDate: (startDate) => set({ startDate }),
  setDueDate: (dueDate) => set({ dueDate }),
}));

export default useContentBlockModal;
