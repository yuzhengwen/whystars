import { ModIndexBasic } from "@/types/modtypes";
import { create } from "zustand";

interface InteractivityState {
  hoveredMod: string;
  setHoveredMod: (mod: string) => void;
  /**
   * null means nothing is clicked  
   * if a lesson block is clicked this variable will hold the modIndex of the clicked lesson block
   */
  selectedMod: ModIndexBasic | null;
  setSelectedMod: (mod: ModIndexBasic | null) => void;
}

export const useInteractivityStore = create<InteractivityState>()((set) => ({
  hoveredMod: "",
  setHoveredMod: (mod) => set(() => ({ hoveredMod: mod })),
  selectedMod: null,
  setSelectedMod: (mod) => set(() => ({ selectedMod: mod })),
}));
