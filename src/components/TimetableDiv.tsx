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
import { useEffect, useMemo, useRef, useState } from "react";
import "@/styles/animations.css";
import { useShallow } from "zustand/shallow";
import { useInteractivityStore } from "@/stores/useInteractivityStore";
import { useTimetableGrid } from "@/hooks/useTimetableGrid";

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
  const setCourseIndex = useTimetableStore((state) => state.setCourseIndex);

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

  const expandedModIndexes = useRef<Set<string>>(new Set());
  // this is the grid that will be displayed in the timetable
  const { days, times, grid } = useMemo(() => {
    const result = createTimeGrid();
    modIndexes.forEach((mod) => {
      if (!mod.lessons?.length) return;
      mod.lessons.forEach((lesson) => {
        if (
          // dont show lectures of expanded mods
          // this is to prevent showing the same lecture multiple times when expanded
          lesson.lesson_type.toLowerCase().includes("lec") &&
          expandedModIndexes.current.has(mod.courseCode + "-" + mod.index)
        )
          return;
        const {
          day,
          timeRange: { startTime, duration },
        } = parseLessonTiming(lesson);
        const rowSpan = Math.ceil(duration / 30);
        result.grid[day][startTime].push(createModLesson(mod, lesson, rowSpan));
      });
    });
    return result;
  }, [modIndexes]);
  const columns = useMemo(() => mapLessonColumns(grid), [grid]);

  const removeAllButClicked = (clicked: ModIndexBasic) => {
    setModIndexes((prev) =>
      prev.filter((mod) => !isExpandedFrom(mod, clicked))
    );
    expandedModIndexes.current.clear();
  };
  const expandMod = (clicked: ModIndexBasic) => {
    const mod = mods.find((mod) => mod.course_code === clicked.courseCode);
    if (!mod || mod.indexes.length == 1) return; // no indexes to expand to
    const newIndexes: ModIndex[] = [];
    // do everything in a single loop
    for (const index of mod.indexes) {
      if (index.index === clicked.index) continue; // skip the index being clicked
      newIndexes.push({
        courseName: mod.course_name,
        courseCode: mod.course_code,
        index: index.index,
        lessons: index.lessons,
      });
      expandedModIndexes.current.add(`${mod.course_code}-${index.index}`);
    }
    setModIndexes((prev) => [...prev, ...newIndexes]);
    setSelectedMod(clicked);
  };

  const handleClick = (clicked: ModLesson) => {
    if (!interactive) return;
    // havent clicked anything yet
    if (!selectedMod) {
      expandMod(clicked);
    } else if (!isExpandedFrom(clicked, selectedMod)) {
      // clicked a different mod during selection
      if (selectedMod.courseCode !== clicked.courseCode) {
        removeAllButClicked(selectedMod);
        expandMod(clicked);
        return;
      }
      // clicked the same mod that was already selected, deselect
      removeAllButClicked(clicked);
      setSelectedMod(null);
    } else if (isExpandedFrom(clicked, selectedMod)) {
      // since there is an actual change in selected indexes, update the global state
      // the changes will be reflected in modIndexes, which will update the timetable
      setCourseIndex(clicked.courseCode, clicked.courseName, clicked.index);
      setSelectedMod(null);
      expandedModIndexes.current.clear();
      // NOTE: this setSelectedMod should NOT be relied on to render the timetable and skip rendering repeated lectures
      // this is because setCourseIndex and setSelected mod are async
      // IF selectedMod finishes updating BEFORE modIndexes is updated, it will trigger grid to re-create and re-render timetable
      // since selectedMod is now null, it will render ALL lectures of ALL expanded mods (Can lead to hundreds of lesson blocks)
      // and then once modIndexes updates, it then renders the correct timetable with no expanded mods
      // Instead we rely on the expandedModIndexes to determine if a lesson should be shown or not, timetable ONLY re-renders when modIndexes changes
      // expandedModIndexes is a ref, so it can be mutated without causing re-renders
    }
  };
  const { earliestStartTime, latestEndTime } = useTimetableGrid(
    mods,
    modIndexesBasic
  );

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
