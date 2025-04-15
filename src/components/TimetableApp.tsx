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
  createModIndexWithString,
} from "@/types/modtypes";
import { useTimetableStore } from "@/stores/useTimetableStore";
import { fetchMod, fetchAllMods } from "@/actions/getMods";
import { useSession } from "next-auth/react";
import UserTimetableSelect from "./UserTimetableSelect";
import GenerateSchedule from "./GenerateSchedule";
import { useInitialTimetable } from "@/context/TimetableContexts";
import { TimetableGrid } from "@/types/TimetableGrid";
import DownloadButton from "./DownloadButton";

export default function TimetableApp() {
  const session = useSession();
  const {
    modIndexesBasic,
    setModIndexesBasic,
    setCourseIndex,
    removeCourse,
    setCurrentTimetable,
  } = useTimetableStore();
  const [mods, setMods] = useState<IMod[]>([]); // contains full mod details
  // mods list with full details automatically updated
  // this has some delay, which means if any component is relying on this, there will be some delay
  useEffect(() => {
    const updateMods = async () => {
      const newMods = await fetchAllMods(modIndexesBasic.map((m) => m.courseCode));
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
    setCurrentTimetable(initialTimetable);
    const selectedIndexes: ModIndexBasic[] = ModIndexBasicArraySchema.parse(
      initialTimetable.modindexes
    );
    setModIndexesBasic(selectedIndexes);
  }, [setModIndexesBasic, initialTimetable, setCurrentTimetable]);

  const handleSelectMod = async (selected: ModInfoBasic) => {
    const newMod = await fetchMod(selected.course_code);
    setMods((prev) => [...prev, newMod]);
    setCourseIndex(
      newMod.course_code,
      newMod.course_name,
      newMod.indexes[0].index
    );
  };

  // show validity of timetable
  const [valid, setValid] = useState(true);
  const [timetableGrid, setTimetableGrid] = useState<TimetableGrid>(
    new TimetableGrid()
  );
  const [clashingModIndexes, setClashingModIndexes] = useState<ModIndexBasic[]>(
    []
  );
  useEffect(() => {
    const newGrid = new TimetableGrid();
    mods.forEach((mod) => {
      newGrid.addIndex(
        createModIndexWithString(mod, selectedIndexes[mod.course_code])
      );
      setTimetableGrid(newGrid);
    });
  }, [mods, selectedIndexes]);
  useEffect(() => {
    console.log("Timetable grid updated", timetableGrid);
    const { isValid, clashingModIndexes } = timetableGrid.isValid();
    setClashingModIndexes(Array.from(clashingModIndexes.values()));
    setValid(isValid);
  }, [timetableGrid]);

  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-start px-10 md:gap-20">
      <div className="flex flex-col w-full md:w-1/3 justify-start items-start">
        <DownloadButton />
        {session.status === "authenticated" && <UserTimetableSelect />}
        <GenerateSchedule mods={mods} />
        {/* <AiButton /> */}
        <ModSearchBar
          selectedStrings={selectedStrings}
          onSelect={handleSelectMod}
        />
        <div>
          Timetable Shown:{" "}
          {valid ? (
            <span className="text-green-500">Valid</span>
          ) : (
            <span className="text-red-600">Contains Clashes</span>
          )}
          {clashingModIndexes.length > 0 && (
            <div className="text-red-600">
              {clashingModIndexes.map((modIndex) => (
                <div key={modIndex.index}>
                  {
                    mods.find((m) => m.course_code === modIndex.courseCode)
                      ?.course_name
                  }{" "}
                  {modIndex.index}
                </div>
              ))}
            </div>
          )}
        </div>
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
