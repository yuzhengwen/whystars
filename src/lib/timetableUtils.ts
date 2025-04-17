import { ModIndexBasic, ModLesson } from "@/types/modtypes";
import { parseLessonTiming } from "./dates";
import { ILesson } from "./models/modModel";
import { days as defaultDays, times as defaultTimes } from "@/lib/constants";

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
export const createTimeGrid = (days?: string[], times?: string[]) => {
  const grid: Record<string, Record<string, ModLesson[]>> = {};
  days = days || defaultDays;
  times = times || defaultTimes;
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

export function checkModLessonsOverlap(lessons: ModLesson[]) {
  // use map to allow comparison by course code instead of object references
  const clashingModIndexes: Map<string, ModIndexBasic> = new Map();
  const busySchedules: Record<string, Record<string, ModLesson[]>> = {};

  // populating busy times
  for (const lesson of lessons) {
    const { day } = parseLessonTiming(lesson);
    const overlapTimes = getLessonTimeOverlaps(lesson, defaultTimes);
    if (!busySchedules[day]) busySchedules[day] = {};
    const timeSlots = busySchedules[day]!;
    for (const time of overlapTimes) {
      if (!timeSlots[time]) timeSlots[time] = [];
      timeSlots[time]!.push(lesson);
    }
  }
  // single out lessons with overlapping times
  const overlappingLessonSets: ModLesson[][] = [];
  for (const day of Object.values(busySchedules)) {
    for (const modLessons of Object.values(day)) {
      if (modLessons.length > 1) {
        overlappingLessonSets.push(modLessons);
      }
    }
  }
  for (const overlappingLessons of overlappingLessonSets) {
    // lessons overlap in time but are legal to overlap
    if (checkLessonsLegalOverlap(overlappingLessons)) continue;
    // else, add to clashingModIndexes
    const modIndexesBasic = overlappingLessons.map(
      (lesson) => lesson as ModIndexBasic
    );
    modIndexesBasic.forEach((modIndex) => {
      const key = `${modIndex.courseCode}-${modIndex.index}`;
      clashingModIndexes.set(key, modIndex);
    });
  }
  return {
    isValid: clashingModIndexes.size === 0,
    clashingModIndexes: clashingModIndexes.values().toArray(),
  };
}
/**
 * Checks if a set of lessons are allowed to overlap in time
 * Currently under 2 conditions it is legal:
 * 1. If the lessons are from the same course
 * 2. If the lessons are on different weeks
 * @param overlappingLessons lessons that overlap in timeslots
 */
export function checkLessonsLegalOverlap(
  overlappingLessons: ModLesson[]
): boolean {
  // determine if lessons overlap in weeks
  const lessonWeeks: number[] = [];
  overlappingLessons.forEach((lesson) => {
    const weeks = extractLessonWeeks(lesson);
    lessonWeeks.push(...weeks);
  });
  if (new Set(lessonWeeks).size === lessonWeeks.length) return true;
  // determine if lessons are from the same course
  if (
    overlappingLessons.every(
      (lesson) => lesson.courseCode === overlappingLessons[0].courseCode
    )
  )
    return true;
  return false;
}
export function checkLessonTimesOverlap(lessons: ILesson[]) {
  const busyTimes: Record<string, string[]> = {};
  lessons.forEach((lesson) => {
    const { day } = parseLessonTiming(lesson);
    if (!busyTimes[day]) busyTimes[day] = [];
    const overlapTimes = getLessonTimeOverlaps(lesson, defaultTimes);
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
}

/**
 *
 * @param lesson
 * @returns array of weeks that the lesson is on
 */
export function extractLessonWeeks(lesson: ILesson): number[] {
  const remark = lesson.remark;
  // e.g. Wk2,4,6,8,10,12
  const weekPattern = /Wk(\d+(?:,\d+)*)/;
  const match = remark.match(weekPattern);
  if (match && match[1]) {
    const weekNumbers = match[1].split(",").map(Number);
    return weekNumbers;
  }
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // default to all weeks if no match found
}
