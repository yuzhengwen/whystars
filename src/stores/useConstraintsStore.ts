import { create } from "zustand";
import { DayConfig } from "@/components/ConstraintsInput";

interface ConstraintsState {
  dayConfigs: DayConfig[];
  addDayConfig: (config: DayConfig) => void;
  removeDayConfig: (index: number) => void;
  setDayConfigAtIndex: (index: number, config: DayConfig) => void;
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
}));
