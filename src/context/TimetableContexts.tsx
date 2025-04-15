"use client";
import { ModInfoBasic } from "@/types/modtypes";
import { timetable } from "@prisma/client";
import { createContext, useContext } from "react";

export const UserTimetablesContext = createContext<timetable[]>([]);
export const useUserTimetables = () => useContext(UserTimetablesContext);

export const InitialTimetableContext = createContext<timetable | null>(null);
export const useInitialTimetable = () => useContext(InitialTimetableContext);

export const ModListContext = createContext<ModInfoBasic[]>([]);
export const useModList = () => useContext(ModListContext);
