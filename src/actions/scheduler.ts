"use server";

import { ILesson, IMod } from "@/lib/models/modModel";
import { checkLessonsOverlap } from "@/lib/timetableUtils";
import {
  createModIndex,
  ModIndexSimple,
  modIndexToSimple,
} from "@/types/modtypes";
import { TimetableGrid } from "@/types/TimetableGrid";

export const generateSchedules = async (selectedMods: IMod[]) => {
  // pre checks
  if (selectedMods.length === 0) {
    console.log("No mods selected");
    return [];
  }
  if (checkLecturesClash(selectedMods)) {
    console.log("Selected mods have clashing lectures");
    return [];
  }

  const allSchedules: ModIndexSimple[][] = [];

  // find all possible combinations of mods by backtracking
  const recursiveGenerate = async (
    i: number,
    currentTimetable: TimetableGrid
  ) => {
    // base cases
    if (allSchedules.length > 3) {
      return;
    }
    if (i === selectedMods.length) {
      // all mods have been added to the schedule
      console.log("All mods added to schedule");
      console.log("------------------------------");
      allSchedules.push(
        currentTimetable.modIndexes.map((m) => modIndexToSimple(m))
      );
      return;
    }

    const currentMod = selectedMods[i];
    console.log(`Trying to add ${currentMod.course_code}`);
    currentMod.indexes.forEach((index) => {
      // check if this index can be added to the current schedule
      if (currentTimetable.canAddToSchedule(index)) {
        const modIndex = createModIndex(currentMod, index);
        currentTimetable.addIndex(modIndex);
        recursiveGenerate(i + 1, currentTimetable);
        // backtrack
        currentTimetable.removeIndex(modIndex);
        if (allSchedules.length > 3) {
          return;
        }
      } else {
        console.log(`Index ${index.index} cannot be added to schedule`);
      }
    });
  };

  await recursiveGenerate(0, new TimetableGrid());

  console.log("\nTotal schedules found:", allSchedules.length);
  allSchedules.forEach((schedule) => {
    console.log("Schedule found:");
    schedule.forEach((modIndex) => {
      console.log(
        `Mod ${modIndex.courseCode} ${modIndex.index} ${modIndex.courseName}`
      );
    });
  });
  return allSchedules;
};

const checkLecturesClash = (selectedMods: IMod[]) => {
  const lectures: ILesson[] = selectedMods
    .map((mod) => {
      return mod.indexes[0].lessons.find((lesson) => {
        return lesson.lesson_type.toLowerCase().includes("lec");
      });
    })
    .filter((lesson): lesson is ILesson => lesson !== undefined);
  return checkLessonsOverlap(lectures);
};
