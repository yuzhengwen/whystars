"use client";
import ModListItem from "@/components/ModListItem";
import TimetableDiv from "@/components/TimetableDiv";
import { IMod } from "@/lib/models/modModel";
import React, { useEffect, useMemo, useState } from "react";
import ModSearchBar from "@/components/ModSearchBar";
import {
  ModInfoBasic,
  ModIndexBasic,
  ModIndexBasicArraySchema,
} from "@/types/modtypes";
import { Button } from "@/components/ui/button";
import { generateSchedules } from "@/actions/scheduler";
import { useTimetableStore } from "@/stores/useTimetableStore";
import { fetchMod, fetchMods } from "@/actions/getMods";
import { useSession } from "next-auth/react";
import UserTimetableSelect from "./UserTimetableSelect";
import { timetable } from "@prisma/client";

interface TimetableAppProps {
  initialTimetable?: timetable | null;
}

export default function TimetableApp(props: TimetableAppProps) {
  const session = useSession();
  const { modIndexesBasic, setModIndexesBasic, setCourseIndex, removeCourse } =
    useTimetableStore();
  const [mods, setMods] = useState<IMod[]>([]); // contains full mod details
  // mods list with full details automatically updated
  // this has some delay, which means if any component is relying on this, there will be some delay
  useEffect(() => {
    const updateMods = async () => {
      const newMods = await fetchMods(modIndexesBasic.map((m) => m.courseCode));
      setMods(newMods);
    };
    updateMods();
  }, [modIndexesBasic]);

  // for the input fields to sync with the selected mod indexes
  const selectedIndexes = useMemo(() => {
    if (!modIndexesBasic) return {};
    const map: Record<string, string> = {};
    modIndexesBasic.forEach(({ courseCode, index }) => {
      map[courseCode] = index;
    });
    return map;
  }, [modIndexesBasic]);

  const selectedStrings = useMemo(() => {
    return modIndexesBasic ? modIndexesBasic.map((m) => m.courseCode) : [];
  }, [modIndexesBasic]);

  // set initial timetable (if any) 
  useEffect(() => {
    if (!props.initialTimetable) return;
    const selectedIndexes: ModIndexBasic[] = ModIndexBasicArraySchema.parse(
      props.initialTimetable.modindexes
    );
    setModIndexesBasic(selectedIndexes);
  }, [setModIndexesBasic, props.initialTimetable]);

  const handleGenerateSchedule = async () => {
    const schedules = await generateSchedules(mods);
    if (!schedules || schedules.length === 0) {
      alert("No schedules found");
      return;
    }
    schedules[0].forEach((schedule) => {
      setCourseIndex(schedule.courseCode, schedule.courseName, schedule.index);
    });
  };
  const handleSelectMod = async (selected: ModInfoBasic) => {
    const newMod = await fetchMod(selected.course_code);
    setMods((prev) => [...prev, newMod]);
    setCourseIndex(
      newMod.course_code,
      newMod.course_name,
      newMod.indexes[0].index
    );
  };

  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-start px-10 md:gap-20">
      <div className="flex flex-col w-full md:w-1/3 justify-start items-center">
        {session.status === "authenticated" && <UserTimetableSelect />}
        <div className="flex flex-col items-start justify-center w-full mt-4 gap-4">
          <Button onClick={handleGenerateSchedule} className="mb-5">
            Generate Schedules
          </Button>
        </div>
        {/* <AiButton /> */}
        <ModSearchBar
          selectedStrings={selectedStrings}
          onSelect={handleSelectMod}
        />
        {mods.map((mod: IMod) => (
          <ModListItem
            key={mod.course_code}
            mod={mod}
            onIndexChange={(mod, newIndex) => {
              setCourseIndex(mod.course_code, mod.course_name, newIndex);
            }}
            onRemove={(mod) => {
              removeCourse(mod.course_code);
            }}
            defaultIndex={
              selectedIndexes[mod.course_code] || mod.indexes[0].index
            }
          />
        ))}
      </div>
      <TimetableDiv mods={mods} />
    </div>
  );
}
