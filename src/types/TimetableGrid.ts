import { parseLessonTiming } from "@/lib/dates";
import { IIndex } from "@/lib/models/modModel";
import { createTimeGrid, getLessonTimeOverlaps } from "@/lib/timetableUtils";
import {
  ModLesson,
  ModIndex,
  createModLesson,
  ModIndexBasic,
} from "./modtypes";

export class TimetableGrid {
  grid: Record<string, Record<string, ModLesson[]>>;
  days: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
  times: string[] = [];
  modIndexes: ModIndex[] = [];
  constructor(days?: string[]) {
    this.days = days || this.days;
    ({ times: this.times, grid: this.grid } = createTimeGrid());
  }
  // FUTURE IMPROVEMENT: Memoize overlap times
  addIndex(modIndex: ModIndex) {
    // add mod index to modIndexes if it doesn't exist
    if (!this.modIndexes.find((index) => index.index === modIndex.index)) {
      this.modIndexes.push(modIndex);
    }
    const { lessons } = modIndex;
    lessons.forEach((lesson) => {
      const overlapTimes = getLessonTimeOverlaps(lesson, this.times);
      const { day } = parseLessonTiming(lesson);
      overlapTimes.forEach((time) => {
        const modLesson = createModLesson(modIndex, lesson);
        this.grid[day][time].push(modLesson);
      });
    });
    console.log(`Added index ${modIndex.index}`);
  }
  removeIndex = (modIndex: ModIndex) => {
    this.modIndexes = this.modIndexes.filter(
      (index) => index.index !== modIndex.index
    );
    const { lessons } = modIndex;
    lessons.forEach((lesson) => {
      const overlapTimes = getLessonTimeOverlaps(lesson, this.times);
      const { day } = parseLessonTiming(lesson);
      overlapTimes.forEach((time) => {
        this.grid[day][time] = this.grid[day][time].filter(
          (modLesson) => modLesson.index !== modIndex.index
        );
      });
    });
    console.log(`Removed index ${modIndex.index}`);
  };
  /**
   * @description: Method: Gets all the time slots needed by new index, check against existing grid for clashes
   * @param index - The index to check if it can be added to the schedule
   * @returns true if the index can be added to the schedule, false otherwise
   */
  canAddToSchedule = (index: IIndex) => {
    if (this.modIndexes.length === 0) return true; // no mods in the grid, so we can add anything
    if (this.modIndexes.find((i) => i.index === index.index)) return false; // already in the grid
    const indexBusyTimes: Record<string, string[]> = {};
    for (const lesson of index.lessons) {
      const { day } = parseLessonTiming(lesson);
      // add the day entry if it doesn't exist
      if (!indexBusyTimes[day]) indexBusyTimes[day] = [];
      // add the time entry on the day
      for (const time of getLessonTimeOverlaps(lesson, this.times))
        indexBusyTimes[day].push(time);
    }
    // check each day and time against the grid
    for (const day in indexBusyTimes) {
      for (const time of indexBusyTimes[day]) {
        if (this.grid[day][time].length > 0) {
          return false;
        }
      }
    }
    return true;
  };
  clear = () => {
    for (const day of this.days) {
      for (const time of this.times) {
        this.grid[day][time] = [];
      }
    }
    this.modIndexes = [];
    return this;
  };
  /**
   * @description: Check if the grid is valid (no clashes) and return the clashing mod indexes
   * @returns { isValid: boolean, clashingModIndexes: Map<string, ModIndexBasic> }
   */
  isValid = () => {
    // use map to avoid duplicates (without strict equality check of Set)
    const clashingModIndexes = new Map<string, ModIndexBasic>();
    for (const day of this.days) {
      for (const time of this.times) {
        const lessons = this.grid[day][time];
        if (
          lessons.length > 1 &&
          lessons.some((lesson) => lesson.index !== lessons[0].index) // ensure at least 2 different lessons (if all lessons are from same index, no clash)
        ) {
          lessons.forEach((lesson) => {
            clashingModIndexes.set(lesson.courseCode, lesson);
          });
        }
      }
    }
    return {
      isValid: clashingModIndexes.size === 0,
      clashingModIndexes,
    };
  };
}
