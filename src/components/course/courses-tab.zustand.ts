import produce from "immer";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";
import type { CourseWithDurationAndProgress } from "@/src/types/user.types";

type State = {
  courses: CourseWithDurationAndProgress[];
  getCourse: (layerId: string) => CourseWithDurationAndProgress | undefined;

  updateCourseTabById: (
    layerId: string,
    data: Partial<CourseWithDurationAndProgress>,
  ) => void;
};

export const useCourseTab = create<State>()((set, get) => ({
  courses: [],
  getCourse: (layerId) =>
    get().courses.find((course) => course.layer_id === layerId),
  updateCourseTabById: (layerId, data) =>
    set((state) =>
      produce(state, (draft) => {
        const idx = draft.courses.findIndex(
          (course) => course.layer_id === layerId,
        );

        const toUpdate = draft.courses[idx];
        if (toUpdate) {
          const newData = { ...toUpdate, ...data };
          draft.courses[idx] = newData;
        }
      }),
    ),
}));

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("useCOurseTab", useCourseTab);
}
