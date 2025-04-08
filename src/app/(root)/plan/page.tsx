"use client";
import SaveTimetable from "@/components/SaveTimetable";
import ModListItem from "@/components/ModListItem";
import TimetableDiv from "@/components/TimetableDiv";
import { IMod } from "@/lib/models/modModel";
import React, { useEffect, useState } from "react";
import ModSearchBar from "@/components/ModSearchBar";
import { ModIndex, ModLesson } from "@/types/modtypes";
import { Button } from "@/components/ui/button";
import { generateSchedules } from "@/actions/scheduler";
import { baseUrl } from "@/lib/baseUrl";
import Link from "next/link";

export default function Home() {
  // record<course_code, index>
  const [selectedIndexes, setSelectedIndexes] = useState<
    Record<string, string>
  >({});
  const [selectedStrings, setSelectedStrings] = useState<string[]>([]);
  const [mods, setMods] = useState<IMod[]>([]);
  const [modIndexes, setModIndexes] = useState<ModIndex[]>([]);

  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await Promise.all(
        selectedStrings.map(async (code) => {
          const res = await fetch(`${baseUrl}/data/mods/${code}.json`);
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

  const removeAllButClicked = (mods: ModIndex[], clicked: ModLesson) => {
    return mods.filter(
      (mod) =>
        mod.courseCode !== clicked.courseCode || mod.index === clicked.index
    );
  };
  const handleClickOnLesson = (clicked: ModLesson) => {
    console.log("clicked", clicked);
    if (clicked.selected) {
      if (!selecting) {
        const mod = mods.find((mod) => mod.course_code === clicked.courseCode);
        if (mod) {
          // add all indexes of the clicked mod
          const newIndexes = mod.indexes
            .map((index) => ({
              courseName: mod.course_name,
              courseCode: mod.course_code,
              index: index.index,
              lessons: index.lessons,
              selected: false,
            }))
            // remove the index being clicked from the newIndexes
            .filter((index) => index.index !== clicked.index);
          console.log("newIndexes", newIndexes);
          setModIndexes((prev) => [...prev, ...newIndexes]);
          setSelecting(true);
        }
      } else {
        // remove all other indexes except the clicked one
        setModIndexes((prev) => removeAllButClicked(prev, clicked));
        setSelecting(false);
      }
    } else {
      setModIndexes((prev) =>
        removeAllButClicked(prev, clicked)
          // set the clicked one to selected
          .map((m) =>
            m.courseCode === clicked.courseCode && m.index === clicked.index
              ? { ...m, selected: true }
              : m
          )
      );
      setSelectedIndexes((prev) => ({
        ...prev,
        [clicked.courseCode]: clicked.index,
      }));
      setSelecting(false);
    }
  };
  const handleGenerateSchedule = async () => {
    const schedules = await generateSchedules(mods);
    if (!schedules || schedules.length === 0) {
      alert("No schedules found");
      return;
    }
    schedules[0].forEach((schedule) => {
      setSelectedIndexes((prev) => ({
        ...prev,
        [schedule.courseCode]: schedule.index,
      }));
    });
  };

  return (
    <div className="flex flex-col md:flex-row w-full justify-center items-start px-10 md:gap-20">
      <div className="flex flex-col w-full md:w-1/3 justify-start items-center">
        <Button>
          <Link href="/mytimetables">My Timetables</Link>
        </Button>
        <SaveTimetable modIndexes={modIndexes} />
        <Button onClick={handleGenerateSchedule} className="mb-5">
          Generate Schedules
        </Button>
        {/* <AiButton /> */}
        <ModSearchBar
          selectedStrings={selectedStrings}
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
      </div>
      <TimetableDiv modIndexes={modIndexes} handleClick={handleClickOnLesson} />
    </div>
  );
}
