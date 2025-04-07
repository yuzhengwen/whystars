import { ILesson } from "./models/modModel";

type TimeRange = {
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  duration: number;
};
// Function to convert time like "1130" to minutes since midnight
function parseTimeToMinutes(timeString: string) {
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = parseInt(timeString.slice(2), 10);
  return hours * 60 + minutes;
}
// parse lesson timing to get the day and time range
export function parseLessonTiming(lesson: ILesson): {
  day: string;
  timeRange: TimeRange;
} {
  const day = lesson.day.trim().toUpperCase();
  const [startTimeString, endTimeString] = lesson.time.split("-");
  const timeRange = {
    startTime: startTimeString.trim(),
    endTime: endTimeString.trim(),
    startMinutes: parseTimeToMinutes(startTimeString),
    endMinutes: parseTimeToMinutes(endTimeString),
    duration: 0,
  };
  timeRange.duration = timeRange.endMinutes - timeRange.startMinutes;
  return { day, timeRange };
}
// Function to check if two time ranges overlap (ignoring the day)
function isTimeOverlap(range1: TimeRange, range2: TimeRange): boolean {
  return (
    range1.startMinutes < range2.endMinutes &&
    range1.endMinutes > range2.startMinutes
  );
}
/**
 * Check if two lessons overlap in time and day
 * @param lesson1
 * @param lesson2
 * @returns
 */
export function isOverlap(lesson1: ILesson, lesson2: ILesson): boolean {
  // extract day and time range from lessons
  const { day: day1, timeRange: range1 } = parseLessonTiming(lesson1);
  const { day: day2, timeRange: range2 } = parseLessonTiming(lesson2);
  // Check if the days are the same and the time ranges overlap
  return day1 === day2 && isTimeOverlap(range1, range2);
}
