import { ModLesson } from "@/types/modtypes";
import { parseLessonTiming } from "./dates";
import { ILesson } from "./models/modModel";
import { days, times } from "@/lib/constants";

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
      const aStart = parseLessonTiming(a).timeRange.startMinutes;
      const bStart = parseLessonTiming(b).timeRange.startMinutes;
      return aStart - bStart;
    })
    .forEach((lesson) => {
      const { timeRange } = parseLessonTiming(lesson);

      let placed = false;
      for (const column of columns) {
        // Check if this lesson can fit in an existing column (no overlap)
        if (
          column.every(
            (l) =>
              parseLessonTiming(l).timeRange.endMinutes <=
                timeRange.startMinutes ||
              parseLessonTiming(l).timeRange.startMinutes >=
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
 * Use it with grid[day][time] to access the lessons for a specific day and time.
 *
 * @returns An object containing the days, times, and the initialized grid.
 * */
export const createTimeGrid = () => {
  const grid: Record<string, Record<string, ModLesson[]>> = {};
  days.forEach((day) => {
    grid[day] = {};
    times.forEach((time) => {
      grid[day][time] = [];
    });
  });
  return { days, times, grid };
};

/**
 * This function returns the time slots that overlap with the lesson's time range.
 * E.g. if the lesson is from 0900 to 1030, and the times are ["0830", "0900", "0930", "1000", "1030"],
 * it will return ["0900", "0930", "1000"].
 * @param lesson
 * @param times
 * @returns
 */
export const getLessonTimeOverlaps = (
  lesson: ILesson,
  times: string[]
): string[] => {
  const { timeRange } = parseLessonTiming(lesson);
  const overlapTimes: string[] = [];
  const { startTime, startMinutes, endMinutes } = timeRange;

  let duration = endMinutes - startMinutes;
  let i = times.indexOf(startTime);
  if (i === -1) {
    throw new Error("Start time not found in times array");
  }
  while (duration > 0) {
    overlapTimes.push(times[i]);
    i++;
    duration -= 30; // Assuming each time slot is 30 minutes
  }

  return overlapTimes;
};
export const checkLessonsOverlap = (lessons: ILesson[]) => {
  // in the format {"MON": ["0830", "0900"]}
  // this means that on MON, there are lessons at 0830 and 0900
  const busyTimes: Record<string, string[]> = {};
  lessons.forEach((lesson) => {
    const { day } = parseLessonTiming(lesson);
    if (!busyTimes[day]) busyTimes[day] = [];
    const overlapTimes = getLessonTimeOverlaps(lesson, times);
    busyTimes[day].push(...overlapTimes);
  });
  for (const day in busyTimes) {
    const times = busyTimes[day];
    const uniqueTimes = new Set(times);
    if (times.length !== uniqueTimes.size) {
      return true; // There are overlaps
    }
  }
  return false; // No overlaps found
};
