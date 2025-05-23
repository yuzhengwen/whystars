import { ILesson } from "./models/modModel";
import { TimeRange } from "./daytime";

// Function to convert time like "1130" to minutes since midnight
export function parseTimeToMinutes(timeString: string) {
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = parseInt(timeString.slice(2), 10);
  return hours * 60 + minutes;
}
export function parseMinutesToTime(minutes:number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}${mins
    .toString()
    .padStart(2, "0")}`;
}
// parse lesson timing to get the day and time range
export function parseLessonTiming(lesson: ILesson): {
  day: string;
  timeRange: TimeRange;
} {
  const day = lesson.day.trim().toUpperCase();
  const [startTimeString, endTimeString] = lesson.time.split("-");
  const timeRange = new TimeRange(startTimeString.trim(), endTimeString.trim());
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
/**
 *
 * @param time1
 * @param time2
 * @returns The difference in minutes between time1 and time2.  
 *          A positive number means time1 is later than time2.  
 *         A negative number means time1 is earlier than time2.
 */
export function compareTimes(time1: string, time2: string): number {
  const time1Minutes = parseTimeToMinutes(time1);
  const time2Minutes = parseTimeToMinutes(time2);
  return time1Minutes - time2Minutes;
}
export function addMinutesToTime(time: string, minutes: number): string {
  const timeInMinutes = parseTimeToMinutes(time);
  const newTimeInMinutes = timeInMinutes + minutes;
  return parseMinutesToTime(newTimeInMinutes);
}
