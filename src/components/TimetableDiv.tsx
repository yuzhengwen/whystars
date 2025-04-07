"use client";
import { parseLessonTiming } from "@/lib/dates";
import { ModIndex, ModLesson } from "@/types/modtypes";
import React from "react";
import LessonBlock from "./LessonBlock";
import { createTimeGrid, mapLessonColumns } from "@/lib/timetableUtils";

const timeSlotHeight = 3; // 3rem

export default function TimetableDiv({
  modIndexes,
  handleClick,
}: {
  modIndexes: ModIndex[];
  handleClick: (lesson: ModLesson) => void;
}) {
  console.log(`Rendering timetable with ${modIndexes.length} modules`);
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
          timeRange: { startTime, startMinutes, endMinutes },
        } = parseLessonTiming(lesson);
        const rowSpan = Math.ceil((endMinutes - startMinutes) / 30);
        grid[day][startTime].push({
          courseName: mod.courseName,
          courseCode: mod.courseCode,
          index: mod.index,
          lesson_type: lesson.lesson_type,
          group: lesson.group,
          day: lesson.day,
          time: lesson.time,
          venue: lesson.venue,
          remark: lesson.remark,
          rowSpan,
          selected: mod.selected,
        });
      });
    }
  });
  const columns = mapLessonColumns(grid);

  return (
    <div className="flex w-full overflow-x-auto">
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
