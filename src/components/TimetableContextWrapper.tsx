// TimetableAppWrapper.tsx
"use client";

import TimetableApp from "./TimetableApp";
import { InitialTimetableContext } from "@/context/TimetableContexts";
import { UserTimetablesContext } from "@/context/TimetableContexts";
import { timetable } from "@prisma/client";

interface TimetableAppWrapperProps {
  initialTimetable: timetable | null;
  userTimetables?: timetable[];
}

export default function TimetableAppWrapper({
  initialTimetable,
  userTimetables = [],
}: TimetableAppWrapperProps) {
  return (
    <InitialTimetableContext.Provider value={initialTimetable}>
      <UserTimetablesContext.Provider value={userTimetables}>
        <TimetableApp />
      </UserTimetablesContext.Provider>
    </InitialTimetableContext.Provider>
  );
}
