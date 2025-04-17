import { create } from "zustand";
import { DayConfig } from "@/components/constraint-inputs/ConstraintsInput";

interface ConstraintsState {
  dayConfigs: DayConfig[];
  addDayConfig: (config: DayConfig) => void;
  removeDayConfig: (index: number) => void;
  setDayConfigAtIndex: (index: number, config: DayConfig) => void;
  lockedList: string[];
  toggleLocked: (courseCode: string, toggle: boolean) => void;
}
/*
const sampleDayConfig: DayConfig[] = [
  { day: "Monday", startTime: "09:00", endTime: "17:00", avoidDay: false },
  { day: "Tuesday", startTime: "09:00", endTime: "17:00", avoidDay: false },
];
*/

export const useConstraintsStore = create<ConstraintsState>()((set) => ({
  dayConfigs: [],
  addDayConfig: (config) =>
    set((state) => ({ dayConfigs: [...state.dayConfigs, config] })),
  removeDayConfig: (index) =>
    set((state) => ({
      dayConfigs: state.dayConfigs.filter((_, i) => i !== index),
    })),
  setDayConfigAtIndex: (index, config) =>
    set((state) => {
      const newConfigs = [...state.dayConfigs];
      newConfigs[index] = config;
      return { dayConfigs: newConfigs };
    }),
  lockedList: [],
  toggleLocked: (courseCode, toggle) =>
    set((state) => {
      const lockedList = new Set(state.lockedList);
      if (toggle) lockedList.add(courseCode);
      else lockedList.delete(courseCode);
      return { lockedList: Array.from(lockedList) };
    }),
}));
