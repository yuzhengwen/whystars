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
import { useTimetableStore } from "@/stores/useTimetableStore";
import { fetchMod, fetchMods } from "@/actions/getMods";
import { useSession } from "next-auth/react";
import UserTimetableSelect from "./UserTimetableSelect";
import GenerateSchedule from "./GenerateSchedule";
import { useInitialTimetable } from "@/context/TimetableContexts";

export default function TimetableApp() {
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
  const initialTimetable = useInitialTimetable();
  useEffect(() => {
    if (!initialTimetable) return;
    const selectedIndexes: ModIndexBasic[] = ModIndexBasicArraySchema.parse(
      initialTimetable.modindexes
    );
    setModIndexesBasic(selectedIndexes);
  }, [setModIndexesBasic, initialTimetable]);

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
      <div className="flex flex-col w-full md:w-1/3 justify-start items-start">
        {session.status === "authenticated" && <UserTimetableSelect />}
        <GenerateSchedule mods={mods} />
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
