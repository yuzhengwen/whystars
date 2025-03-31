import { parseLessonTiming } from "@/lib/dates";
import { ILesson } from "@/lib/models/modModel";
import React from "react";
import LessonBlock from "./LessonBlock";
import { createTimeGrid, mapLessonColumns } from "@/lib/timetableUtils";

// Represents the CHOSEN mod + index
type ModIndex = {
  courseName: string;
  courseCode: string;
  index: string;
  lessons: ILesson[];
};
// Represents the specific lesson of each mod + index
export type ModLesson = {
  courseName: string;
  courseCode: string;
  index: string;
  lesson: ILesson;
  rowSpan: number;
};
const timeSlotHeight = 3; // 3rem

function Timetable({ modIndexes }: { modIndexes: ModIndex[] }) {
  console.log(`Rendering timetable with ${modIndexes.length} modules`);

  const { days, times, grid } = createTimeGrid();

  // populate the grid with lessons
  modIndexes.forEach((mod) => {
    if (mod.lessons && mod.lessons.length > 0) {
      mod.lessons.forEach((lesson) => {
        const {
          day,
          timeRange: { startTime, startMinutes, endMinutes },
        } = parseLessonTiming(lesson);
        const rowSpan = Math.ceil((endMinutes - startMinutes) / 30);

        grid[day][startTime].push({ ...mod, lesson, rowSpan });
      });
    }
  });
  const columns = mapLessonColumns(grid);
  
  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-[5rem_repeat(6,_1fr)] text-center font-bold">
        <div></div>
        {days.map((day) => (
          <div key={day} className="py-6">
            {day}
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="flex flex-col w-20 text-right text-sm">
          {times.map((time) => (
            <div key={time} className="h-[3rem] border-b border-gray-300">
              {time}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 w-full">
          {days.map((day) => (
            <div key={day} className="relative border-r border-gray-300">
              {/* Background stripes for each time slot */}
              <div className="flex flex-col justify-start items-start h-full">
                {times.slice(0, times.length / 2).map((_, i) => (
                  <div
                    key={i}
                    className={`h-[calc(6rem)] w-full ${
                      i % 2 === 0 ? "bg-secondary" : "bg-background"
                    }`}
                  />
                ))}
              </div>
              {/*Column Container*/}
              <div className="absolute flex top-0 left-0 w-full h-full gap-1">
                {columns[day].map((column, colIndex) => (
                  <div
                    // each column is a flex container for the lessons
                    key={colIndex}
                    className={`relative w-full h-full flex-grow`}
                  >
                    {column.map((lesson, lessonIndex) => {
                      // render each lesson block in the column
                      const { startTime } = parseLessonTiming(
                        lesson.lesson
                      ).timeRange;
                      const startIdx = times.indexOf(startTime);
                      return (
                        <LessonBlock
                          key={lessonIndex}
                          lesson={lesson}
                          top={startIdx * timeSlotHeight}
                          height={lesson.rowSpan * timeSlotHeight}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Timetable;
