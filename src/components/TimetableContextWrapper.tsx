"use client";

import TimetableApp from "./TimetableApp";
import {
  InitialTimetableContext,
  ModListContext,
} from "@/context/TimetableContexts";
import { UserTimetablesContext } from "@/context/TimetableContexts";
import { ModInfoBasic } from "@/types/modtypes";
import { timetable } from "@prisma/client";

interface TimetableAppWrapperProps {
  initialTimetable: timetable | null;
  userTimetables?: timetable[];
  modListData?: ModInfoBasic[];
}

export default function TimetableAppWrapper({
  initialTimetable,
  userTimetables = [],
  modListData = [],
}: TimetableAppWrapperProps) {
  return (
    <InitialTimetableContext.Provider value={initialTimetable}>
      <UserTimetablesContext.Provider value={userTimetables}>
        <ModListContext.Provider value={modListData}>
            <TimetableApp />
        </ModListContext.Provider>
      </UserTimetablesContext.Provider>
    </InitialTimetableContext.Provider>
  );
}
