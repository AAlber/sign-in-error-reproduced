import { create } from "zustand";
import type { ContentBlock } from "@/src/types/course.types";

type State = {
  sectionsWhoAreInView: ContentBlock[];
  setSectionsWhoAreInView: (sections: ContentBlock[], remove?: boolean) => void;
  hideSectionOverview: boolean;
  setHideSectionOverview: (hide: boolean) => void;
  blocksBeforeSections: ContentBlock[];
  setBlocksBeforeSections: (blocks: ContentBlock[]) => void;
  lastBlockBeforeSection: ContentBlock | null;
  setLastBlockBeforeSection: (block: ContentBlock) => void;
};

export const useSectionOverview = create<State>((set) => ({
  sectionsWhoAreInView: [],
  setSectionsWhoAreInView: (sections, remove = false) => {
    set((state) => {
      let updatedSections = [...state.sectionsWhoAreInView];

      if (remove) {
        sections.forEach((section) => {
          updatedSections = updatedSections.filter(
            (item) => item.id !== section.id,
          );
        });
      } else {
        sections.forEach((section) => {
          const existingIndex = updatedSections.findIndex(
            (item) => item.id === section.id,
          );
          if (existingIndex !== -1) {
            updatedSections[existingIndex] = section;
          } else {
            updatedSections.push(section);
          }
        });
        updatedSections.sort((a, b) => a.position! - b.position!);
      }

      return { sectionsWhoAreInView: updatedSections };
    });
  },
  hideSectionOverview: false,
  setHideSectionOverview: (hide) => {
    set({ hideSectionOverview: hide });
  },
  blocksBeforeSections: [],
  setBlocksBeforeSections: (blocks) => {
    set({ blocksBeforeSections: blocks });
  },
  lastBlockBeforeSection: null,
  setLastBlockBeforeSection: (block) => {
    set({ lastBlockBeforeSection: block });
  },
}));
