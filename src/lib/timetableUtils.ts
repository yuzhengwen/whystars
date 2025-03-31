import { ModLesson } from "@/components/TimetableDiv";
import { parseLessonTiming } from "./dates";

/**
 *
 * @param grid The grid of lessons for each day and time slot
 * @returns A whole week of lessons, grouped by day, and then by columns
 *         Each column contains lessons that do not overlap in time
 */
export function mapLessonColumns(
  grid: Record<string, Record<string, ModLesson[]>>
): Record<string, ModLesson[][]> {
  const columns: Record<string, ModLesson[][]> = {};
  for (const day in grid) {
    const lessons = grid[day];
    const lessonsFlat = Object.values(lessons).flat();
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
/**
 * Creates a time grid for the timetable.
 * The grid is a 2D array representing the days of the week and time slots.
 * Each time slot is initialized with an empty array to hold lessons.
 *
 * @returns An object containing the days, times, and the initialized grid.
 * */
export const createTimeGrid = () => {
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const generateTimeSlots = (start: string, end: string, interval: string) => {
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
