import cuid from "cuid";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { deepCopy } from "@/src/client-functions/client-utils";
import type { Workbench, WorkbenchElement } from "./types";

export enum WorkbenchType {
  LEARNING,
  ASSESSMENT,
}

export enum WorkbenchMode {
  CREATE,
  FILLOUT,
  REVIEW,
  READONLY,
}

const initialState = {
  noNameError: false,
  open: false,
  refresh: 0,
  currentPage: "",
  mode: WorkbenchMode.CREATE,
  workbenchType: WorkbenchType.ASSESSMENT,
  blockId: "",
  selectedUser: undefined,
  selectedElement: "",
  submittedUsers: [],
  documents: [],
  content: {
    title: "",
    pages: [],
  },
};

const useWorkbench = create<Workbench>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentPage: (data) => {
        const pages = get().content.pages;
        const pageIndex = pages.findIndex((page) => page.id === data);
        if (pageIndex === -1) return;
        pages[pageIndex]!.new = false;
        set(() => ({ currentPage: data }));
      },
      getIndexOfElement: (elementId) => {
        const elements = get().getElementsOfCurrentPage();
        return elements.findIndex((element) => element.id === elementId);
      },
      getCurrentPage: () =>
        get().content.pages.find((page) => page.id === get().currentPage)!,
      setTitle: (data) => {
        set((state) => ({ content: { ...state.content, title: data } }));
      },
      setOpen: (data) => set(() => ({ open: data })),
      setMode: (data) => set(() => ({ mode: data })),
      setContent: (data) => set(() => ({ content: data })),
      setPages: (data) =>
        set((state) => ({ content: { ...state.content, pages: data } })),
      updatePageThumbnail: (pageId, thumbnail) => {
        const pages = get().content.pages;
        const index = pages.findIndex((page) => page.id === pageId);
        if (index === -1) return;
        pages[index]!.thumbnail = thumbnail;
        set((state) => ({ content: { ...state.content, pages } }));
      },
      getElementById: (elementId) => {
        const pages = get().content.pages;
        for (const page of pages) {
          const element = page.elements.find(
            (element) => element.id === elementId,
          );
          if (element) return element;
        }
        return undefined;
      },
      getPages: () => get().content.pages,
      addPage: () =>
        set((state) => ({
          content: {
            ...state.content,
            pages: [
              ...state.content.pages.slice(
                0,
                get().getIndexOfPage(get().currentPage) + 1,
              ),
              { id: cuid(), elements: [], thumbnail: "" },
              ...state.content.pages.slice(
                get().getIndexOfPage(get().currentPage) + 1,
              ),
            ],
          },
        })),
      insertNewPage: (index) => {
        const pages = get().content.pages;
        pages.splice(index, 0, {
          id: cuid(),
          elements: [],
          thumbnail: "",
        });
        set((state) => ({ content: { ...state.content, pages } }));
      },
      getIndexOfPage: (pageId) =>
        get().content.pages.findIndex((page) => page.id === pageId),
      insertPage: (page, index) => {
        const pages = get().content.pages;
        pages.splice(index, 0, page);
        set((state) => ({ content: { ...state.content, pages } }));
      },
      addContentToPage: (pageId, content) => {
        const pages = get().content.pages;
        const pageIndex = pages.findIndex((page) => page.id === pageId);
        if (pageIndex === -1) return;
        pages[pageIndex]!.elements = [
          ...pages[pageIndex]!.elements,
          ...content,
        ];
        set((state) => ({ content: { ...state.content, pages } }));
      },
      addContentToNewPage: (content) => {
        const pages = get().content.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPage,
        );
        if (pageIndex === -1) return;
        pages.splice(pageIndex + 1, 0, {
          id: cuid(),
          elements: content,
          thumbnail: "",
          new: true,
        });
        set((state) => ({ content: { ...state.content, pages } }));
      },
      removePage: (pageId) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: state.content.pages.filter((page) => page.id !== pageId),
          },
        })),
      setElements: (data) =>
        set((state) => ({
          content: {
            ...state.content,
            pages: [
              ...state.content.pages.map((page) => ({
                ...page,
                elements: page.id === get().currentPage ? data : page.elements,
              })),
            ],
          },
        })),
      getElementsOfCurrentPage: () => {
        return get().content.pages.find(
          (page) => page.id === get().currentPage,
        )!.elements;
      },
      getElementsOfPage: (pageId) => {
        const pages = get().content.pages;
        const pageIndex = pages.findIndex((page) => page.id === pageId);
        if (pageIndex === -1) return [];
        if (!pages[pageIndex]) return [];
        return pages[pageIndex]!.elements;
      },
      appendElement: (data) =>
        set((state) => {
          const currentPageId = state.currentPage;
          const newPages = [...state.content.pages];
          const pageIndex = newPages.findIndex(
            (page) => page.id === currentPageId,
          );
          if (pageIndex === -1) return state;
          if (!newPages[pageIndex]) return state;

          newPages[pageIndex]!.elements = [
            ...newPages[pageIndex]!.elements,
            data,
          ];
          return { content: { ...state.content, pages: newPages } };
        }),
      addElement: (data) =>
        set((state) => {
          const currentPageId = state.currentPage;
          const newPages = [...state.content.pages];
          const pageIndex = newPages.findIndex(
            (page) => page.id === currentPageId,
          );
          if (pageIndex === -1) return state;
          if (!newPages[pageIndex]) return state;

          newPages[pageIndex]!.elements = [
            ...newPages[pageIndex]!.elements,
            data,
          ];
          return { content: { ...state.content, pages: newPages } };
        }),
      addElementAt: (data, index) =>
        set((state) => {
          const currentPageId = state.currentPage;
          const newPages = [...state.content.pages];
          const pageIndex = newPages.findIndex(
            (page) => page.id === currentPageId,
          );
          if (pageIndex === -1) return state;
          if (!newPages[pageIndex]) return state;

          newPages[pageIndex]!.elements = [
            ...newPages[pageIndex]!.elements.slice(0, index),
            data,
            ...newPages[pageIndex]!.elements.slice(index),
          ];
          return { content: { ...state.content, pages: newPages } };
        }),
      removeElement: (elementId) => {
        const currentPageId = get().currentPage;
        const newPages = [...get().content.pages];
        const pageIndex = newPages.findIndex(
          (page) => page.id === currentPageId,
        );
        if (pageIndex === -1) return;

        newPages[pageIndex]!.elements = newPages[pageIndex]!.elements.filter(
          (element) => element.id !== elementId,
        );
        set((state) => ({ content: { ...state.content, pages: newPages } }));
      },
      updateElement: (elementId, updates) => {
        const currentPageId = get().currentPage;
        const newPages = [...get().content.pages];
        const pageIndex = newPages.findIndex(
          (page) => page.id === currentPageId,
        );
        if (pageIndex === -1) return;

        const elementIndex = newPages[pageIndex]!.elements.findIndex(
          (element) => element.id === elementId,
        );
        if (elementIndex === -1) return;

        newPages[pageIndex]!.elements[elementIndex] = {
          ...newPages[pageIndex]!.elements[elementIndex],
          ...updates,
        };
        set((state) => ({ content: { ...state.content, pages: newPages } }));
      },
      updateElementMetadata: (elementId, metadata) =>
        set((state) => {
          const currentPageId = state.currentPage;
          const newPages = [...state.content.pages];
          const pageIndex = newPages.findIndex(
            (page) => page.id === currentPageId,
          );
          if (pageIndex === -1) return state;
          if (!newPages[pageIndex]) return state;

          newPages[pageIndex]!.elements = newPages[
            pageIndex
          ]!.elements.map<WorkbenchElement>((element) =>
            element.id === elementId
              ? {
                  ...element,
                  metadata: { ...deepCopy(element.metadata), ...metadata },
                }
              : element,
          );
          return { content: { ...state.content, pages: newPages } };
        }),
      getElementMetadata: (elementId) => {
        const currentPageId = get().currentPage;
        const currentPage = get().content.pages.find(
          (page) => page.id === currentPageId,
        );

        if (!currentPage) return {};

        const element = currentPage.elements.find(
          (element) => element.id === elementId,
        );

        if (typeof element === "undefined") return {};

        return deepCopy(element.metadata);
      },
      setSelectedUser: (data) => set(() => ({ selectedUser: data })),
      setSelectedElement: (data) => set(() => ({ selectedElement: data })),
      addSubmittedUser: (user) =>
        set((state) => ({
          submittedUsers: state.submittedUsers.find((u) => u.id === user.id)
            ? state.submittedUsers
            : [...state.submittedUsers, user],
        })),
      addDocument: (document) =>
        set((state) => ({ documents: [...state.documents, document] })),
      reset: () => set(() => ({ ...initialState })),
      refreshWorkbench: () => set((state) => ({ refresh: state.refresh + 1 })),
      updateDocument: (userId, content) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.userId === userId ? { ...d, content } : d,
          ),
        })),
      removeDocument: (documentId) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== documentId),
        })),
      openEmptyWorkbench: (workbenchType) =>
        set(() => {
          const id = cuid();
          return {
            open: true,
            currentPage: id,
            blockId: "",
            mode: WorkbenchMode.CREATE,
            workbenchType: workbenchType,
            content: {
              title: "",
              pages: [
                {
                  id: id,
                  elements: [],
                  thumbnail: "",
                },
              ],
            },
          };
        }),
      openPregeneratedWorkbench: (workbenchType) =>
        set(() => {
          return {
            open: true,
            blockId: "",
            mode: WorkbenchMode.CREATE,
            workbenchType: workbenchType,
          };
        }),
      openWorkbenchWithContent: (data) =>
        set(() => ({
          open: true,
          blockId: "",
          currentPage: data.content.pages[0]!.id,
          mode: data.readOnly ? WorkbenchMode.READONLY : WorkbenchMode.CREATE,
          workbenchType: data.workbenchType,
          content: data.content,
        })),
      openWorkbenchFromBlock: (data) =>
        set(() => ({
          ...initialState,
          open: true,
          currentPage: data.content.pages[0]!.id,
          blockId: data.blockId,
          content: data.content,
          mode: data.mode,
          workbenchType: data.workbenchType,
        })),
      openWorkbenchFromUserData: (data) =>
        set(() => ({
          ...initialState,
          open: true,
          currentPage: data.content.pages[0]!.id,
          blockId: data.blockId,
          content: data.content,
          mode: WorkbenchMode.REVIEW,
          workbenchType: data.workbenchType,
          selectedUser: data.user,
        })),
    }),
    { name: "workbench" },
  ),
);

export default useWorkbench;

useWorkbench.subscribe((state, prev) => {
  if (prev.open && !state.open) {
    state.selectedUser = undefined;
  }
});

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  mountStoreDevtool("workbench", useWorkbench);
}
