"use client";
import ModListItem from "@/components/ModListItem";
import TimetableDiv from "@/components/TimetableDiv";
import { IMod } from "@/lib/models/modModel";
import React, { useEffect, useMemo, useState } from "react";
import ModSearchBar from "@/components/ModSearchBar";
import { ModInfoBasic, ModIndexBasic } from "@/types/modtypes";
import { Button } from "@/components/ui/button";
import { generateSchedules } from "@/actions/scheduler";
import { baseUrl } from "@/lib/baseUrl";
import { useRouter, useSearchParams } from "next/navigation";
import { useTimetableStore } from "@/stores/useTimetableStore";
import { fetchMod, fetchMods } from "@/actions/getMods";
import { useSession } from "next-auth/react";
import UserTimetableSelect from "./UserTimetableSelect";

export default function TimetableApp() {
  const session = useSession();
  const router = useRouter();
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

  // load timetable from url params (timetableId)
  const searchParams = useSearchParams();
  const timetableId = searchParams.get("id") || "";
  const timetableName = searchParams.get("name") || "";
  useEffect(() => {
    const fetchAndSetDefaults = async () => {
      // if not signed in, redirect to /plan
      if (session.status !== "authenticated") {
        router.push("/plan");
        return;
      }
      if (timetableId && timetableName) {
        try {
          const res = await fetch(`${baseUrl}/api/timetables/${timetableId}`);
          const data = await res.json();
          if (data) {
            const selectedIndexes: ModIndexBasic[] = data.modindexes;
            setModIndexesBasic(selectedIndexes);
          }
        } catch {
          router.push("/plan");
        }
      }
    };
    fetchAndSetDefaults();
  }, [timetableId, timetableName, setModIndexesBasic, router, session.status]);

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
