import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ModIndexBasic } from "@/types/modtypes";

interface TimetableState {
  modIndexesBasic: ModIndexBasic[];
  setModIndexesBasic: (modIndexSimple: ModIndexBasic[]) => void;
  setCourseIndex: (
    courseCode: string,
    courseName: string,
    index: string
  ) => void;
  removeCourse: (courseCode: string) => void;
}

export const useTimetableStore = create<TimetableState>()(
  persist(
    (set, get) => ({
      modIndexesBasic: [],
      setModIndexesBasic: (data) => set({ modIndexesBasic: data }),

      setCourseIndex: (courseCode, courseName, index) => {
        const current = get().modIndexesBasic;
        const exists = current.find((m) => m.courseCode === courseCode);
        const updated = exists
          ? // if the courseCode exists, update the index
            current.map((m) =>
              m.courseCode === courseCode ? { ...m, index: index } : m
            )
          : // if the courseCode does not exist, add it to the array
            [...current, { courseCode, courseName, index }];
        set({ modIndexesBasic: updated });
      },

      removeCourse: (courseCode) => {
        const current = get().modIndexesBasic;
        set({
          modIndexesBasic: current.filter((m) => m.courseCode !== courseCode),
        });
      },
    }),
    {
      name: "timetable-store", // localStorage key
      //storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
