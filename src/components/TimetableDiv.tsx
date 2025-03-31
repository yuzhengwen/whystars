import { parseLessonTiming } from "@/lib/dates";
import { ILesson } from "@/lib/models/modModel";
import React from "react";
import LessonBlock from "./LessonBlock";

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
  colNo: number;
};
const timeSlotHeight = 3; // 3rem

function Timetable({ modIndexes }: { modIndexes: ModIndex[] }) {
  console.log(`Rendering timetable with ${modIndexes.length} modules`);

  const createTimeGrid = () => {
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const generateTimeSlots = (
      start: string,
      end: string,
      interval: string
    ) => {
      const startTime = parseInt(start);
      const endTime = parseInt(end);
      const intervalMinutes = parseInt(interval);
      const slots = [];
      let currentMinutes = Math.floor(startTime / 100) * 60 + (startTime % 100);
      const endMinutes = Math.floor(endTime / 100) * 60 + (endTime % 100);

      while (currentMinutes <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
          .toString()
          .padStart(2, "0")}`;
        slots.push(formattedTime);
        currentMinutes += intervalMinutes;
      }
      return slots;
    };
    const times = generateTimeSlots("0830", "1930", "30");

    const grid: Record<string, Record<string, ModLesson[]>> = {};
    days.forEach((day) => {
      grid[day] = {};
      times.forEach((time) => {
        grid[day][time] = [];
      });
    });
    return { days, times, grid };
  };

  const { days, times, grid } = createTimeGrid();

  modIndexes.forEach((mod) => {
    if (mod.lessons && mod.lessons.length > 0) {
      mod.lessons.forEach((lesson) => {
        const {
          day,
          timeRange: { startTime, endTime, startMinutes, endMinutes },
        } = parseLessonTiming(lesson);
        const rowSpan = Math.ceil((endMinutes - startMinutes) / 30);
        console.log(
          `Adding ${mod.courseCode} to ${day} at ${startTime}-${endTime} with rowSpan ${rowSpan}`
        );

        grid[day][startTime].push({
          ...mod,
          lesson,
          rowSpan,
          colNo: 0, // default each lesson to column 0
        });
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

/**
 *
 * @param grid The grid of lessons for each day and time slot
 * @returns A whole week of lessons, grouped by day, and then by columns
 *         Each column contains lessons that do not overlap in time
 */
function mapLessonColumns(
  grid: Record<string, Record<string, ModLesson[]>>
): Record<string, ModLesson[][]> {
  const columns: Record<string, ModLesson[][]> = {};
  for (const day in grid) {
    const lessons = grid[day];
    const lessonsFlat = Object.values(lessons).flat();
    console.log(groupLessonsByColumns(lessonsFlat));
    columns[day] = groupLessonsByColumns(lessonsFlat);
  }
  return columns;
}
/**
 *
 * @param lessons
 * @returns The columns for each day in format: [[Lesson1, lesson 2], [Lesson3, lesson4]] where each array is a column of lessons
 */
const groupLessonsByColumns = (lessons: ModLesson[]): ModLesson[][] => {
  const columns: ModLesson[][] = [];

  lessons
    .sort((a, b) => {
      const aStart = parseLessonTiming(a.lesson).timeRange.startMinutes;
      const bStart = parseLessonTiming(b.lesson).timeRange.startMinutes;
      return aStart - bStart;
    })
    .forEach((lesson) => {
      const { timeRange } = parseLessonTiming(lesson.lesson);

      let placed = false;

      for (const column of columns) {
        // Check if this lesson can fit in an existing column (no overlap)
        if (
          column.every(
            (l) =>
              parseLessonTiming(l.lesson).timeRange.endMinutes <=
                timeRange.startMinutes ||
              parseLessonTiming(l.lesson).timeRange.startMinutes >=
                timeRange.endMinutes
          )
        ) {
          column.push(lesson);
          placed = true;
          break;
        }
      }

      // If no existing column works, create a new column
      if (!placed) {
        columns.push([lesson]);
      }
    });

  return columns;
};
