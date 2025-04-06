"use client";
import SaveTimetable from "@/components/SaveTimetable";
import AiButton from "@/components/AiButton";
import ModListItem from "@/components/ModListItem";
import SelectMods from "@/components/SelectMods";
import TimetableDiv from "@/components/TimetableDiv";
import { IMod } from "@/lib/models/modModel";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [selectedIndexes, setSelectedIndexes] = useState<
    Record<string, string>
  >({});
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [mods, setMods] = useState<IMod[]>([]);
  const handleModsChange = (selectedValues: string[]) => {
    setSelectedMods(selectedValues);
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await Promise.all(
        selectedMods.map(async (code) => {
          const res = await fetch(
            `http://localhost:3000/data/mods/${code}.json`
          );
          const data = await res.json();
          return data;
        })
      );
      if (res) {
        setMods(res);
      }
    };
    fetchData();
  }, [selectedMods]);

  // for testing we just use the first index of each mod
  const modIndexes = mods.map((mod: IMod) => {
    const selectedIndex =
      selectedIndexes[mod.course_code] || mod.indexes[0].index;
    const indexObj =
      mod.indexes.find((i) => i.index === selectedIndex) || mod.indexes[0];

    return {
      courseName: mod.course_name,
      courseCode: mod.course_code,
      index: indexObj.index,
      lessons: indexObj.lessons,
    };
  });

  const onIndexChange = (mod: IMod, newIndex: string) => {
    console.log("Index changed to:", newIndex);
    setSelectedIndexes((prev) => ({
      ...prev,
      [mod.course_code]: newIndex,
    }));
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Plan</h1>
      <p className="mt-4 text-lg">This is the plan page.</p>
      <AiButton />

      <SelectMods onChange={handleModsChange} />
      {mods.map((mod: IMod) => (
        <ModListItem
          key={mod.course_code}
          mod={mod}
          onIndexChange={onIndexChange}
        />
      ))}

      <SaveTimetable />
      <TimetableDiv modIndexes={modIndexes} />
    </div>
  );
}
