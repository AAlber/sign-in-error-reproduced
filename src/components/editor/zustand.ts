import cuid from "cuid";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Editor } from "./types";

const firstPageId = cuid();

const initialState = {
  open: false,
  canCreate: true,
  canInteract: false,
  currentPageId: firstPageId,
  originBlockId: undefined,
  data: {
    pages: [
      {
        id: firstPageId,
        content: null,
      },
    ],
  },
};

export const useEditor = create<Editor>()(
  persist(
    (set, get) => ({
      ...initialState,

      setOpen: (data) => {
        return set(() => ({
          open: data,
        }));
      },
      updateCurrentPageContent: (data) => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPageId,
        );
        if (pageIndex === -1) return;
        const newPages = [...pages];
        if (!newPages[pageIndex]) return;
        newPages[pageIndex]!.content = data;
        set(() => ({
          data: {
            pages: newPages,
          },
        }));
      },

      getCurrentPageThumbnail: () => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPageId,
        );
        if (pageIndex === -1) return null;
        if (!pages[pageIndex]) return null;
        return pages[pageIndex]!.thumbnail;
      },

      getCurrentPageContent: () => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPageId,
        );
        if (pageIndex === -1) return null;
        if (!pages[pageIndex]) return null;
        return pages[pageIndex]!.content;
      },

      setCurrentPageId: (data) => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex((page) => page.id === data);
        if (pageIndex === -1) return;
        set(() => ({ currentPageId: data }));
      },

      setPages: (data) =>
        set(() => ({
          data: {
            pages: data,
          },
        })),

      updatePageThumbnail: (pageId, thumbnail) => {
        set((state) => {
          const newPages = state.data.pages.map((page) => {
            if (page.id === pageId) {
              return { ...page, thumbnail: thumbnail };
            }
            return page;
          });
          return { data: { pages: newPages } };
        });
      },

      insertPage: (pageIndex, pageContent) => {
        set((state) => {
          const newPages = [...state.data.pages];
          const id = cuid();
          newPages.splice(pageIndex, 0, { id: id, content: pageContent });
          return { data: { pages: newPages, currentPageId: id } };
        });
      },

      removePage: (pageId) => {
        set((state) => {
          return {
            data: {
              pages: state.data.pages.filter((page) => page.id !== pageId),
            },
          };
        });
      },

      getIndexOfPage: (pageId) => {
        const pages = get().data.pages;
        return pages.findIndex((page) => page.id === pageId);
      },

      insertNewPage: (pageIndex, pageContent) => {
        set((state) => {
          const newPages = [...state.data.pages];
          newPages.splice(pageIndex, 0, {
            id: cuid(),
            content: pageContent || null,
          });
          return { data: { pages: newPages } };
        });
      },

      goToPreviousPage: () => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPageId,
        );
        if (pageIndex === -1) return;
        if (pageIndex === 0) return;
        set(() => ({ currentPageId: pages[pageIndex - 1]!.id }));
      },

      goToNextPage: () => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPageId,
        );
        if (pageIndex === -1) return;
        if (pageIndex === pages.length - 1) return;
        set(() => ({ currentPageId: pages[pageIndex + 1]!.id }));
      },

      canChangePage: (direction) => {
        const pages = get().data.pages;
        const pageIndex = pages.findIndex(
          (page) => page.id === get().currentPageId,
        );
        if (pageIndex === -1) return false;
        if (direction === "next") {
          return pageIndex < pages.length - 1;
        } else {
          return pageIndex > 0;
        }
      },

      getPages: () => get().data.pages,

      addPage: () =>
        set((state) => ({
          data: {
            pages: [
              ...state.data.pages,
              {
                id: cuid(),
                content: null,
              },
            ],
          },
        })),

      openEditor: (data, options) => {
        set(() => ({
          ...initialState,
          open: true,
          data: data ? data : { pages: [{ id: firstPageId, content: null }] },
          currentPageId: data ? data.pages[0]!.id : firstPageId,
          // Options
          canCreate: options?.canCreate ?? true,
          canInteract: options?.canInteract ?? false,
          originBlockId: options?.originBlockId,
        }));
      },
    }),
    { name: "editor" },
  ),
);
