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
import { useEffect, useMemo, useState } from "react";
import "@/styles/animations.css";
import { useShallow } from "zustand/shallow";
import { useInteractivityStore } from "@/stores/useInteractivityStore";
import { TimetableGrid } from "@/types/TimetableGrid";

const timeSlotHeight = 3; // 3rem

export default function TimetableDiv({
  mods,
  modIndexesBasic,
  interactive = true,
  fixedHeight = true,
  modColors,
}: {
  mods: IMod[];
  modIndexesBasic: ModIndexBasic[];
  interactive?: boolean;
  fixedHeight?: boolean;
  modColors: Record<string, string>;
}) {
  const { setCourseIndex } = useTimetableStore();

  // client side state to track current selected and hovered mods
  const { hoveredMod, selectedMod, setSelectedMod } = useInteractivityStore(
    useShallow((state) => ({
      hoveredMod: state.hoveredMod,
      selectedMod: state.selectedMod,
      setSelectedMod: state.setSelectedMod,
    }))
  );
  /**
   * Helper function to check if the modIndex is expanded from the selectedMod
   * Meaning it appeared after clicking on a lesson block
   * and is same course code as the one clicked but different index
   * @param modIndex
   * @returns
   */
  function isExpandedFrom(
    modIndex: ModIndexBasic,
    selectedMod: ModIndexBasic | null
  ) {
    return (
      selectedMod &&
      modIndex.courseCode === selectedMod.courseCode &&
      modIndex.index !== selectedMod.index
    );
  }

  // this state is local and used to track the selected + unselected indexes to be displayed
  // when the user clicks on a mod, it will add all the indexes of that mod to the timetable
  // if there is an actual change in mods/indexes selected, must also update the global state (TimetableStore)
  const [modIndexes, setModIndexes] = useState<ModIndex[]>([]);
  useEffect(() => {
    // if number is different, means one hasn't updated yet, wait
    if (mods.length !== modIndexesBasic.length) return;
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

  // potentially fit this entire chunk in useMemo? Currently causes rendering issues due to dependencies
  const { days, times, grid } = createTimeGrid();
  // populate the grid with lessons
  modIndexes.forEach((mod) => {
    if (mod.lessons && mod.lessons.length > 0) {
      mod.lessons.forEach((lesson) => {
        // skip lectures for indexes that are expanded but not selected (since lectures are all same time)
        if (
          lesson.lesson_type.toLowerCase().includes("lec") &&
          isExpandedFrom(mod, selectedMod)
        )
          return;
        const {
          day,
          timeRange: { startTime, duration },
        } = parseLessonTiming(lesson);
        const rowSpan = Math.ceil(duration / 30);
        grid[day][startTime].push(createModLesson(mod, lesson, rowSpan));
      });
    }
  });
  const columns = mapLessonColumns(grid);

  const removeAllButClicked = (clicked: ModIndexBasic) => {
    setModIndexes((prev) =>
      prev.filter((mod) => !isExpandedFrom(mod, clicked))
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
    if (!interactive) return;
    // havent clicked anything yet
    if (!selectedMod) {
      expandMod(clicked);
      setSelectedMod(clicked);
    } else if (!isExpandedFrom(clicked, selectedMod)) {
      // clicked a different mod during selection
      if (selectedMod.courseCode !== clicked.courseCode) {
        removeAllButClicked(selectedMod);
        expandMod(clicked);
        setSelectedMod(clicked);
        return;
      }
      // clicked the same mod that was already selected
      removeAllButClicked(clicked);
      setSelectedMod(null);
    } else if (isExpandedFrom(clicked, selectedMod)) {
      // since there is an actual change in selected indexes, update the global state
      // the changes will be reflected in modIndexes, which will update the timetable
      setCourseIndex(clicked.courseCode, clicked.courseName, clicked.index);
      setSelectedMod(null);
    }
  };

  // filter out time slots unused
  const [timetableGrid, setTimetableGrid] = useState<TimetableGrid>(
    new TimetableGrid()
  );
  const earliestStartTime = useMemo(() => {
    return timetableGrid.isEmpty()
      ? "No Mods Selected"
      : timetableGrid.findEarliestStartTime();
  }, [timetableGrid]);
  const latestEndTime = useMemo(() => {
    return timetableGrid.isEmpty()
      ? "No Mods Selected"
      : timetableGrid.findLatestEndTime();
  }, [timetableGrid]);
  useEffect(() => {
    const newGrid = new TimetableGrid();
    mods.forEach((mod) => {
      newGrid.addIndex(
        createModIndexWithString(
          mod,
          modIndexesBasic.find((m) => m.courseCode == mod.course_code)?.index ??
            mod.indexes[0].index
        )
      );
      setTimetableGrid(newGrid);
    });
  }, [mods, modIndexesBasic]);

  //filter out time slots unused
  const filteredTimes = fixedHeight
    ? times
    : times.filter(
        (time) => time >= earliestStartTime && time <= latestEndTime
      );

  // not sure why overflow-y-hidden works without cutting off anything but ok
  return (
    <div
      className="flex w-full overflow-x-auto overflow-y-hidden border-5 border-gray-200 dark:border-gray-800 rounded-lg"
      id="timetable-app"
    >
      {/* Time slots on the left */}
      <div
        className={`relative flex flex-col w-20 text-right text-sm mt-18 pr-1`}
      >
        {filteredTimes.map((time) => (
          <div
            key={time}
            className="h-[3rem] border-b border-gray-400 first:border-t"
          >
            {time}
          </div>
        ))}
      </div>
      {/* Right side: Days and columns */}
      <div className="relative flex flex-col w-full">
        {/* Timetable Main Grid */}
        <div className="flex w-full h-full ">
          {days.map((day) => (
            <div
              key={day + "column"}
              className="relative flex-1 border-r border-gray-400 h-full first:border-l last:border-r-0"
            >
              {/* Background stripes for each time slot */}
              <div
                className="absolute top-18 left-0 right-0 bottom-0 z-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, var(--secondary) 6rem, var(--background) 0)",
                  backgroundSize: "100% 12rem", // Two time slots (2 * 6rem)
                  backgroundRepeat: "repeat-y",
                }}
              />
              <div
                key={"header" + day}
                className="flex-1 p-6 border-b border-gray-300 text-center font-bold "
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
                            // hover effect only when no mods actively selected
                            hovered={
                              !selectedMod && hoveredMod === lesson.courseCode
                            }
                            selected={selectedMod}
                            color={modColors[lesson.courseCode] || "blue"}
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
