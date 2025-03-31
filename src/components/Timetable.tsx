import { parseLessonTiming } from "@/lib/dates";
import { ILesson } from "@/lib/models/modModel";
import React from "react";

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
        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
        slots.push(formattedTime);
        currentMinutes += intervalMinutes;
      }
      return slots;
    };
    const times = generateTimeSlots("0830", "2300", "30"); // 30-minute intervals from 0830 to 2300

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
