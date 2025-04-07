"use client";
import SaveTimetable from "@/components/SaveTimetable";
import AiButton from "@/components/AiButton";
import ModListItem from "@/components/ModListItem";
import TimetableDiv from "@/components/TimetableDiv";
import { IMod } from "@/lib/models/modModel";
import React, { useEffect, useState } from "react";
import ModSearchBar from "@/components/ModSearchBar";
import { ModIndex, ModLesson } from "@/types/modtypes";

export default function Home() {
  // record<course_code, index>
  const [selectedIndexes, setSelectedIndexes] = useState<
    Record<string, string>
  >({});
  const [selectedStrings, setSelectedStrings] = useState<string[]>([]);
  const [mods, setMods] = useState<IMod[]>([]);
  const [modIndexes, setModIndexes] = useState<ModIndex[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Promise.all(
        selectedStrings.map(async (code) => {
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
  }, [selectedStrings]);

  useEffect(() => {
    // Update modIndexes whenever mods or selectedIndexes change
    const updatedModIndexes = mods.map((mod: IMod) => {
      const indexObj =
        mod.indexes.find((i) => i.index === selectedIndexes[mod.course_code]) ||
        mod.indexes[0];
      return {
        courseName: mod.course_name,
        courseCode: mod.course_code,
        index: indexObj.index,
        lessons: indexObj.lessons,
        selected: true,
      };
    });
    setModIndexes(updatedModIndexes);
  }, [mods, selectedIndexes]);

  const handleClickOnLesson = (lesson: ModLesson) => {
    if (lesson.selected) {
      const mod = mods.find((mod) => mod.course_code === lesson.courseCode);
      if (mod) {
        const newIndexes = mod.indexes.map((index) => ({
          courseName: mod.course_name,
          courseCode: mod.course_code,
          index: index.index,
          // filter out lectures from lessons
          lessons: index.lessons,
          selected: false,
        }));
        setModIndexes((prev) => [...prev, ...newIndexes]);
      }
    } else {
      const newModIndex = modIndexes.find(
        (mod) =>
          mod.courseCode === lesson.courseCode && mod.index === lesson.index
      );
      if (newModIndex) {
        newModIndex.selected = true;
      }
      const newModIndexes = modIndexes.filter(
        (mod) =>
          mod.courseCode !== lesson.courseCode || mod.index === lesson.index
      );
      setModIndexes(newModIndexes);
      setSelectedIndexes((prev) => ({
        ...prev,
        [lesson.courseCode]: lesson.index,
      }));
    }
  };

  return (
    <div className="flex flex-row w-full justify-center items-center px-10 gap-20">
      <div className="flex flex-col w-1/3 h-screen overflow-y-auto justify-start items-center">
        <AiButton />
        <ModSearchBar
          onSelect={(mod) =>
            setSelectedStrings((prev) => [...prev, mod.course_code])
          }
        />
        {mods.map((mod: IMod) => (
          <ModListItem
            key={mod.course_code}
            mod={mod}
            onIndexChange={(mod, newIndex) => {
              setSelectedIndexes((prev) => ({
                ...prev,
                [mod.course_code]: newIndex,
              }));
            }}
            onRemove={(mod) => {
              setSelectedStrings((prev) =>
                prev.filter((code) => code !== mod.course_code)
              );
            }}
            defaultIndex={
              selectedIndexes[mod.course_code] || mod.indexes[0].index
            }
          />
        ))}
        <SaveTimetable modIndexes={modIndexes} />
      </div>
      <TimetableDiv modIndexes={modIndexes} handleClick={handleClickOnLesson} />
    </div>
  );
}
