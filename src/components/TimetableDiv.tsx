"use client";
import { parseLessonTiming } from "@/lib/dates";
import {
  createModIndexWithString,
  createModLesson,
  ModIndex,
  ModIndexBasic,
  ModLesson,
} from "@/types/modtypes";
import LessonBlock from "./LessonBlock";
import { createTimeGrid, mapLessonColumns } from "@/lib/timetableUtils";
import { useTimetableStore } from "@/stores/useTimetableStore";
import { IMod } from "@/lib/models/modModel";
import { useEffect, useState } from "react";

const timeSlotHeight = 3; // 3rem

export default function TimetableDiv({ mods }: { mods: IMod[] }) {
  const { modIndexesBasic, setCourseIndex } = useTimetableStore();

  // handles local state of which mod is currently being clicked on
  const [selected, setSelected] = useState<ModIndexBasic | null>(null);

  // this state is local and used to track the selected + unselected indexes to be displayed
  // when the user clicks on a mod, it will add all the indexes of that mod to the timetable
  // if there is an actual change in mods/indexes selected, must also update the global state (TimetableStore)
  const [modIndexes, setModIndexes] = useState<ModIndex[]>([]);
  useEffect(() => {
    // modIndexesBasic is the global source of truth
    const newIndexes = modIndexesBasic.map((modIndex) => {
      const detailedMod = mods.find(
        (m) => m.course_code === modIndex.courseCode
      );
      if (!detailedMod) throw new Error(`${modIndex.courseCode} not found`);
      return createModIndexWithString(detailedMod, modIndex.index);
    });
    setModIndexes(newIndexes);
  }, [mods, modIndexesBasic]);

  const { days, times, grid } = createTimeGrid();
  // populate the grid with lessons
  modIndexes.forEach((mod) => {
    if (mod.lessons && mod.lessons.length > 0) {
      mod.lessons.forEach((lesson) => {
        // skip lectures for unselected indexes (since lectures are all same time)
        if (lesson.lesson_type.toLowerCase().includes("lec") && !mod.selected)
          return;
        const {
          day,
          timeRange: { startTime, duration },
        } = parseLessonTiming(lesson);
        const rowSpan = Math.ceil(duration / 30);
        grid[day][startTime].push(
          createModLesson(mod, lesson, rowSpan, mod.selected)
        );
      });
    }
  });
  const columns = mapLessonColumns(grid);

  const removeAllButClicked = (clicked: ModIndexBasic) => {
    setModIndexes((prev) =>
      prev.filter(
        (mod) =>
          mod.courseCode !== clicked.courseCode || mod.index === clicked.index
      )
    );
  };
  const expandMod = (clicked: ModIndexBasic) => {
    const mod = mods.find((mod) => mod.course_code === clicked.courseCode);
    if (!mod) return;
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
    setModIndexes((prev) => [...prev, ...newIndexes]);
  };

  const handleClick = (clicked: ModLesson) => {
    console.log("clicked", clicked);
    if (clicked.selected && !selected) {
      expandMod(clicked);
      setSelected(clicked);
    } else if (clicked.selected && selected) {
      // clicked a different mod
      if (selected.courseCode !== clicked.courseCode) {
        removeAllButClicked(selected);
        expandMod(clicked);
        setSelected(clicked);
        return;
      }
      // clicked the same mod that was selected
      removeAllButClicked(clicked);
      setSelected(null);
    } else if (!clicked.selected) {
      // since there is an actual change in selected indexes, update the global state
      // the changes will be reflected in modIndexes, which will update the timetable
      setCourseIndex(clicked.courseCode, clicked.courseName, clicked.index);
      setSelected(null);
    }
  };
  // not sure why overflow-y-hidden works without cutting off anything but ok
  return (
    <div className="flex w-full overflow-x-auto overflow-y-hidden">
      {/* Time slots on the left */}
      <div
        className={`relative flex flex-col w-20 text-right text-sm mt-18 pr-1`}
      >
        {times.map((time) => (
          <div key={time} className="h-[3rem] border-b border-gray-300">
            {time}
          </div>
        ))}
      </div>
      {/* Right side: Days and columns */}
      <div className="relative flex flex-col w-full">
        {/* Background stripes for each time slot */}
        <div
          className={`absolute flex flex-col justify-start items-start h-full w-full top-18 left-0 z-0`}
        >
          {times.slice(0, times.length / 2).map((_, i) => (
            <div
              key={"bg" + i}
              className={`h-24 w-full ${
                i % 2 === 0 ? "bg-secondary" : "bg-background"
              }`}
            />
          ))}
        </div>
        {/* Timetable Main Grid */}
        <div className="flex w-full h-full ">
          {days.map((day) => (
            <div
              key={day + "column"}
              className="relative flex-1 border-r border-gray-300 h-full"
            >
              <div
                key={"header" + day}
                className="flex-1 p-6 border-b border-gray-300 text-center font-bold"
              >
                {day}
              </div>
              {/*Column Container*/}
              <div className="relative top-0 left-0 w-full h-full gap-1">
                <div className="relative flex gap-1 w-full h-full">
                  {columns[day].map((column, colIndex) => (
                    <div
                      // each column is a flex container for the lessons
                      key={"column" + colIndex}
                      className="relative w-full h-full flex-grow min-w-24"
                    >
                      {column.map((lesson, lessonIndex) => {
                        // render each lesson block in the column
                        const { startTime } =
                          parseLessonTiming(lesson).timeRange;
                        let yOffset = times.indexOf(startTime);
                        if (lessonIndex > 0) {
                          yOffset += 0.8 / timeSlotHeight; // offset the slightly smaller lesson blocks
                          const prevLesson = column[lessonIndex - 1];
                          const { endTime } =
                            parseLessonTiming(prevLesson).timeRange;
                          // ntu timeslots end at xx:20, add 10 minutes to get the next timeslot
                          if (endTime[-2] != "3") {
                            const endTimeAdjusted = (parseInt(endTime) + 10)
                              .toString()
                              .padStart(4, "0");
                            yOffset -= times.indexOf(endTimeAdjusted);
                          }
                        }
                        return (
                          <LessonBlock
                            onClick={handleClick}
                            key={lesson.courseName + lesson.index + lessonIndex}
                            lesson={lesson}
                            top={yOffset * timeSlotHeight}
                            height={lesson.rowSpan * timeSlotHeight - 0.8} // slightly smaller height
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
