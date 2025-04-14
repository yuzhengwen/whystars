import { parseLessonTiming } from "@/lib/dates";
import { ILesson } from "@/lib/models/modModel";
import React from "react";
import { days, times } from "@/lib/constants";

// type for chosen index of a mod
type ModIndex = {
  courseName: string;
  courseCode: string;
  index: string;
  lessons: ILesson[];
};
// type for displaying each lesson in the timetable
type ModLesson = {
  courseName: string;
  courseCode: string;
  index: string;
  lesson: ILesson;
  rowSpan: number;
};
function Timetable({ modIndexes }: { modIndexes: ModIndex[] }) {
  console.log(`Rendering timetable with ${modIndexes.length} modules`);
  // Helper function to create a time grid
  function createTimeGrid(): Record<string, Record<string, ModLesson[]>> {
    const grid: Record<string, Record<string, ModLesson[]>> = {};
    days.forEach((day: string) => {
      grid[day] = {};
      times.forEach((time: string) => {
        grid[day][time] = [];
      });
    });
    return grid;
  }

  const grid = createTimeGrid();

  // Populate the grid with course data
  modIndexes.forEach((mod) => {
    if (mod.lessons && mod.lessons.length > 0) {
      mod.lessons.forEach((lesson) => {
        const {
          day,
          timeRange: { startTime, startMinutes, endMinutes },
        } = parseLessonTiming(lesson);
        // startTime is 0830, need 08:30
        const formattedStartTime = `${startTime.slice(0, 2)}:${startTime.slice(
          2
        )}`;
        const rowSpan = Math.floor((endMinutes - startMinutes) / 30);
        console.log(
          `Adding ${mod.courseCode} to ${day} at ${formattedStartTime} with rowSpan ${rowSpan}`
        );
        grid[day][formattedStartTime].push({ ...mod, lesson, rowSpan });
      });
    }
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Time/Day</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.slice(0, -1).map((time, index) => (
            <tr key={time}>
              <td>{`${time}-${times[index + 1]}`}</td>
              {days.map((day) => {
                const cellData = grid[day][time];
                return (
                  <td key={`${day}-${time}`} className="border p-2 ">
                    {cellData &&
                      cellData.map((modLesson) => (
                        <div key={modLesson.courseCode}>
                          {`${modLesson.courseCode} (${modLesson.index}) - ${modLesson.lesson.lesson_type} - ${modLesson.lesson.group} - ${modLesson.lesson.venue}`}
                        </div>
                      ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;
