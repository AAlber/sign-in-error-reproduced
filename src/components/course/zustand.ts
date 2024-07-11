import { arrayMove } from "@dnd-kit/sortable";
import { dequal } from "dequal";
import { produce } from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import type { ScheduleAppointment } from "@/src/types/appointment.types";
import type { ContentBlock } from "@/src/types/course.types";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";
import { useCourseTab } from "./courses-tab.zustand";

export enum CoursePage {
  ORGANIZER,
  LEARNING_JOURNEY,
  PEER_FEEDBACK,
  USERS,
  SETTINGS,
}

type CourseFilter = 1 | 2 | 3 | 4;

interface CourseProps {
  appointments: ScheduleAppointment[];
  contentBlocks: ContentBlock[];
  course: CourseWithDurationAndProgress;
  courseThemeChanged: boolean;
  creatingPost: boolean;
  filter: CourseFilter[];
  hasSpecialRole: boolean;
  isTestingMode: boolean;
  page: CoursePage;
  posts: any[];
  refresh: number;
  search: string;
  blocksAreLoading: boolean;
  courseTabChangeLoading: boolean;
}

interface CourseMethods {
  refreshCourse(): void;
  setAppointments: (data: ScheduleAppointment[]) => void;
  setContentBlocks: (data: CourseProps["contentBlocks"]) => void;
  setCourseThemeChanged: (data: boolean) => void;
  setCreatingPost: (data: boolean) => void;
  setFilter: (data: CourseProps["filter"]) => void;
  setHasSpecialRole: (data: boolean) => void;
  setPage: (data: CoursePage) => void;
  setPosts: (data: CourseProps["posts"]) => void;
  setRefresh: (data: number) => void;
  setSearch: (data: string) => void;
  setcourseTabChangeLoading: (data: boolean) => void;
  setTestingMode: (data: boolean) => void;
  removeContentBlock: (id: string) => void;
  updateAppointment: (id: string, data: Partial<ScheduleAppointment>) => void;
  updateCourse: (data: Partial<CourseWithDurationAndProgress>) => void;
  updateContentBlock: (blockId: string, data: Partial<ContentBlock>) => void;
  updateContentBlockPosition: (blockId: string, newIndex: number) => void;
  updateContentBlockRequirements: (
    id: string,
    requirementId: string,
    operation: "add" | "remove",
  ) => void;
}

const initalState: CourseProps = {
  appointments: [],
  blocksAreLoading: false,
  course: {} as CourseWithDurationAndProgress,
  courseThemeChanged: false,
  filter: [],
  creatingPost: false,
  page: CoursePage.LEARNING_JOURNEY,
  hasSpecialRole: false,
  isTestingMode: false,
  posts: [],
  contentBlocks: [],
  refresh: 0,
  search: "",
  courseTabChangeLoading: false,
};

const useCourse = create<CourseProps & CourseMethods>()((set) => ({
  ...initalState,
  removeContentBlock: (id) =>
    set((state) =>
      produce(state, (draft) => {
        const blockToRemoveIndex = draft.contentBlocks.findIndex(
          (block) => block.id === id,
        );

        // 1. If any block depends on the block to be removed, reset requirements
        draft.contentBlocks.forEach((block) => {
          const reqIdx = block.requirements.findIndex((req) => req.id === id);
          if (reqIdx > -1) block.requirements = [];
        });

        // 2. remove the block from contentBlocks state
        if (blockToRemoveIndex > -1)
          draft.contentBlocks.splice(blockToRemoveIndex, 1);
      }),
    ),
  setAppointments: (data) => set(() => ({ appointments: data })),
  setContentBlocks: (data) =>
    set((state) => {
      const contentBlocks = data.filter(
        (block) => block.layerId === state.course.layer_id,
      );
      return { contentBlocks };
    }),
  setCourseThemeChanged: (data) => set(() => ({ courseThemeChanged: data })),
  setCreatingPost: (data) => set(() => ({ creatingPost: data })),
  setFilter: (data) => set(() => ({ filter: data })),
  setHasSpecialRole: (data) => set(() => ({ hasSpecialRole: data })),
  setPage: (data) => set(() => ({ page: data })),
  setPosts: (data) => set(() => ({ posts: data })),
  setRefresh: (data) => set(() => ({ refresh: data })),
  setSearch: (data) => set(() => ({ search: data })),
  setTestingMode: (data) => set(() => ({ isTestingMode: data })),
  setcourseTabChangeLoading: (data) =>
    set(() => ({ courseTabChangeLoading: data })),
  updateAppointment: (id, data) => {
    set((state) =>
      produce(state, (draft) => {
        const index = draft.appointments.findIndex((i) => i.id === id);
        if (index > -1) {
          const appointmentToUpdate = draft.appointments[index]!;
          const keys = Object.keys(data) as (keyof ScheduleAppointment)[];
          keys.forEach((key) => {
            // TODO: fix typing
            (appointmentToUpdate as any)[key] = data[key];
          });
        }
      }),
    );
  },

  updateContentBlock: (id, data) =>
    set((state) =>
      produce(state, (draft) => {
        const index = draft.contentBlocks.findIndex((block) => block.id === id);
        if (index > -1) {
          const blockToUpdate = draft.contentBlocks[index]!;
          const keys = Object.keys(data) as (keyof ContentBlock)[];
          keys.forEach((key) => {
            blockToUpdate[key] = data[key];
          });

          // also update data within affected block requirements
          draft.contentBlocks.forEach(({ requirements }) => {
            const reqIdx = requirements.findIndex(
              ({ id }) => id === blockToUpdate.id,
            );
            if (reqIdx > -1) requirements[reqIdx] = blockToUpdate;
          });

          /**
           * if userStatus has change, also update the
           * userStatus of the block requiring the `blockToUpdate`
           */

          if ("userStatus" in data) {
            draft.contentBlocks.forEach((block) => {
              const blockRequirementHasChange = block.requirements.some(
                (req) => req.id === blockToUpdate.id,
              );

              if (blockRequirementHasChange) {
                block.userStatus = evaluateUserStatusFromRequirements(block);
              }
            });
          } else {
            draft.contentBlocks.forEach((block) => {
              block.userStatus = evaluateUserStatusFromRequirements(block);
            });
          }
        }
      }),
    ),

  updateContentBlockRequirements: (id, requirementId, operation) =>
    set((state) =>
      produce(state, (draft) => {
        const blockToUpdate = draft.contentBlocks.find(
          (block) => block.id === id,
        );
        const requirement = draft.contentBlocks.find(
          (block) => block.id === requirementId,
        );

        if (blockToUpdate && requirement) {
          if (operation === "add") blockToUpdate.requirements.push(requirement);
          else {
            /**
             * TODO: once new block requirements is implemented, idx here will always be 0
             * as contentBlocks will then can only have 1 requirement
             */
            const idx = blockToUpdate.requirements.findIndex(
              (block) => block.id === requirementId,
            );
            if (idx > -1) blockToUpdate.requirements.splice(idx, 1);
          }
        }

        draft.contentBlocks.forEach((block) => {
          block.userStatus = evaluateUserStatusFromRequirements(block);
        });
      }),
    ),

  updateContentBlockPosition: (id, newIdx) => {
    set((state) =>
      produce(state, (draft) => {
        const contentBlocks = draft.contentBlocks;
        const fromIdx = contentBlocks.findIndex((i) => i.id === id);
        draft.contentBlocks = arrayMove(contentBlocks, fromIdx, newIdx);
      }),
    );
  },

  updateCourse: (data) =>
    set((state) => ({ course: { ...state.course, ...data } })),

  refreshCourse: () => set((state) => ({ refresh: state.refresh + 1 })),
}));

export default useCourse;

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useCourse", useCourse);
}

function evaluateUserStatusFromRequirements(block: ContentBlock) {
  const hasCompletedAllRequirements = block.requirements.every(
    (b) => b.userStatus === "FINISHED" || b.userStatus === "REVIEWED",
  );

  return block.userStatus !== "FINISHED" && block.userStatus !== "REVIEWED"
    ? hasCompletedAllRequirements
      ? "NOT_STARTED"
      : "LOCKED"
    : block.userStatus;
}

useCourse.subscribe((state, prev) => {
  if (
    !dequal(
      state.course.totalContentBlockCount,
      prev.course.totalContentBlockCount,
    )
  ) {
    const { updateCourseTabById } = useCourseTab.getState();
    updateCourseTabById(state.course.layer_id, {
      totalContentBlockCount: state.course.totalContentBlockCount,
    });
  }
});
