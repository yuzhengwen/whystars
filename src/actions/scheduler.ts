"use server";

import { DayConfig } from "@/components/constraint-inputs/ConstraintsInput";
import { parseLessonTiming } from "@/lib/dates";
import { TimeRange } from "@/lib/daytime";
import { IIndex, ILesson, IMod } from "@/lib/models/modModel";
import { checkLessonTimesOverlap } from "@/lib/timetableUtils";
import {
  createModIndex,
  createModIndexWithString,
  ModIndexBasic,
  modIndexToSimple,
} from "@/types/modtypes";
import { TimetableGrid } from "@/types/TimetableGrid";

const maxSchedules = 100;
export const generateSchedules = async (
  selectedMods: IMod[],
  dayConfigs?: DayConfig[],
  lockedList?: ModIndexBasic[]
): Promise<{ generatedSchedules: ModIndexBasic[][]; error: string }> => {
  // pre checks that terminate function early if fails
  if (selectedMods.length === 0) {
    return { generatedSchedules: [], error: "No mods selected" };
  }
  if (checkLecturesClash(selectedMods)) {
    return { generatedSchedules: [], error: "Lectures clash" };
  }

  let filteredMods = selectedMods;
  if (dayConfigs && dayConfigs.length > 0) {
    const { valid, whiteList } = filterConstraints(
      selectedMods,
      dayConfigs as DayConfig[]
    );
    if (!valid || whiteList.size === 0) {
      return {
        generatedSchedules: [],
        error: "Constraints cannot be satisfied",
      };
    }
    // update filteredMods with the whiteList
    filteredMods = selectedMods.map((mod) => {
      const indexes = whiteList.get(mod.course_code);
      if (indexes) {
        return {
          ...mod,
          indexes: mod.indexes.filter((index) => indexes.has(index.index)),
        };
      }
      return mod;
    });
  }

  const allSchedules: ModIndexBasic[][] = [];

  // find all possible combinations of mods by backtracking
  const recursiveGenerate = async (
    i: number,
    currentTimetable: TimetableGrid
  ) => {
    // base cases
    if (allSchedules.length >= maxSchedules) {
      return;
    }
    if (i === filteredMods.length) {
      // all mods have been added to the schedule
      console.log("All mods added to schedule");
      console.log("------------------------------");
      allSchedules.push(
        currentTimetable.modIndexes.map((m) => modIndexToSimple(m))
      );
      return;
    }

    const currentMod = filteredMods[i];
    console.log(`Trying to add ${currentMod.course_code}`);
    currentMod.indexes.forEach((index) => {
      // check if this index can be added to the current schedule
        const modIndex = createModIndex(currentMod, index);
      if (currentTimetable.canAddToSchedule(modIndex)) {
        currentTimetable.addIndex(modIndex);
        recursiveGenerate(i + 1, currentTimetable);
        currentTimetable.removeIndex(modIndex); // backtrack
      } else {
        console.log(`Index ${index.index} cannot be added to schedule`);
      }
    });
  };

  const timetableGrid = new TimetableGrid();
  // pre populate with locked mod indexes
  if (lockedList) {
    for (const lockedCourseCode of lockedList) {
      const mod = filteredMods.find(
        (mod) => mod.course_code === lockedCourseCode.courseCode
      );
      if (!mod) {
        return {
          generatedSchedules: [],
          error: "Constraints cannot be satisfied given the locked mods",
        };
      }
      timetableGrid.addIndex(
        createModIndexWithString(mod, lockedCourseCode.index)
      );
    }
  }
  // remove locked mods from filteredMods so we don't try to add them again
  filteredMods = filteredMods.filter(
    (mod) =>
      !lockedList?.some((lockedMod) => lockedMod.courseCode === mod.course_code)
  );
  // call recursive function
  await recursiveGenerate(0, timetableGrid);

  if (allSchedules.length === 0)
    return { generatedSchedules: [], error: "No schedules could be generated" };
  return { generatedSchedules: allSchedules, error: "" };
};

const checkLecturesClash = (selectedMods: IMod[]) => {
  // assuming all indexes will have the same lecture time
  const lectures: ILesson[] = selectedMods
    .map((mod) => {
      return mod.indexes[0].lessons.find((lesson) => {
        return lesson.lesson_type.toLowerCase().includes("lec");
      });
    })
    .filter((lesson): lesson is ILesson => lesson !== undefined);
  return checkLessonTimesOverlap(lectures);
};

/**
 *
 * @param selectedMods original selected mods
 * @param dayConfigs
 * @returns whitelist of mods and their indexes that are valid given the constraints
 */
const filterConstraints = (
  selectedMods: IMod[],
  dayConfigs: DayConfig[]
): { valid: boolean; whiteList: Map<string, Set<string>> } => {
  const whiteList = new Map<string, Set<string>>();
  function whiteListIndex(mod: IMod, index: string) {
    if (!whiteList.has(mod.course_code)) {
      whiteList.set(mod.course_code, new Set<string>());
    }
    whiteList.get(mod.course_code)?.add(index);
  }
  // index is valid if all lessons do not overlap with the config time range
  function isIndexValid(index: IIndex) {
    return index.lessons.every((lesson) => {
      const { day, timeRange: lessonTimeRange } = parseLessonTiming(lesson);
      const config = dayConfigs.find((c) => c.day === day);
      if (config) {
        if (config.avoidDay) return false; // any lesson on this day is invalid
        const configTimeRange = new TimeRange(config.startTime, config.endTime);
        return !configTimeRange.isOverlap(lessonTimeRange); // true if no overlap
      }
      return true; // if no config for that day, valid
    });
  }

  // remove all indexes with lessons that are not in the constraints
  for (const mod of selectedMods) {
    mod.indexes.forEach((index) => {
      if (isIndexValid(index)) {
        whiteListIndex(mod, index.index);
      }
    });
    // if any mod has no valid indexes, return invalid
    if (!whiteList.has(mod.course_code)) {
      return { valid: false, whiteList: new Map() };
    }
  }
  return { valid: true, whiteList };
};
