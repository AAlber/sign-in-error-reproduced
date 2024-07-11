import { create } from "zustand";

interface CourseManagement {
  page: number;
  setPage: (page: number) => void;
  points: number;
  setPoints: (points: number) => void;
  attendence: number;
  setAttendence: (attendence: number) => void;
  refresh: number;
  setRefresh: (refresh: number) => void;
  users: CourseMember[];
  setUsers: (data: CourseMember[]) => void;
}

const initalState = {
  page: 1,
  refresh: 0,
  points: 0,
  attendence: 0,
  users: [],
};

const useCourseManagement = create<CourseManagement>()((set) => ({
  ...initalState,
  setPage: (page) => set({ page }),
  setRefresh: (refresh) => set({ refresh }),
  setUsers: (data) => set({ users: data }),
  setPoints: (points) => set({ points }),
  setAttendence: (attendence) => set({ attendence }),
}));

export default useCourseManagement;
