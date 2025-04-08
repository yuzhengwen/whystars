import { create } from 'zustand';

type ModColorState = {
  modColors: Record<string, string>;
  setModColor: (modCode: string, color: string) => void;
};

export const useModColorStore = create<ModColorState>((set) => ({
  modColors: {},
  setModColor: (modCode, color) =>
    set((state) => ({
      modColors: {
        ...state.modColors,
        [modCode]: color,
      },
    })),
}));
