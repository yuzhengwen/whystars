import { IIndex, ILesson, IMod } from "@/lib/models/modModel";
import { z } from "zod";

export const ModBasicInfoSchema = z.array(
  z.object({
    course_code: z.string(),
    course_name: z.string(),
    aus: z.number(),
  })
);
export type ModInfoBasic = {
  course_code: string;
  course_name: string;
  aus: number;
};
export interface ModIndexBasic {
  courseName: string;
  courseCode: string;
  index: string;
}
// load timetable from url params (timetableId)
const ModIndexBasicSchema = z.object({
  courseName: z.string(),
  courseCode: z.string(),
  index: z.string(),
});
export const ModIndexBasicArraySchema = z.array(ModIndexBasicSchema);
// Represents the CHOSEN mod + index
export type ModIndex = ModIndexBasic & {
  lessons: ILesson[];
  selected?: boolean;
};
// Represents the specific lesson of each mod + index
export type ModLesson = ModIndexBasic &
  ILesson & {
    rowSpan: number;
    selected?: boolean;
  };

// helper functions to convert between the types
export function modIndexToSimple(modIndex: ModIndex): ModIndexBasic {
  return {
    courseName: modIndex.courseName,
    courseCode: modIndex.courseCode,
    index: modIndex.index,
  };
}
export function createModLesson(
  modIndex: ModIndexBasic,
  lesson: ILesson,
  rowSpan?: number,
  selected?: boolean
): ModLesson {
  return {
    ...lesson,
    courseName: modIndex.courseName,
    courseCode: modIndex.courseCode,
    index: modIndex.index,
    rowSpan: rowSpan || 1,
    selected: selected || false,
  };
}
export function createModIndex(mod: IMod, index: IIndex): ModIndex {
  return {
    courseName: mod.course_name,
    courseCode: mod.course_code,
    index: index.index,
    lessons: index.lessons,
    selected: true,
  };
}
export function createModIndexWithString(mod: IMod, index: string) {
  let foundIndex = mod.indexes.find((i) => i.index === index);
  if (!foundIndex) {
    foundIndex = mod.indexes[0]; // default to the first index if not found
  }
  return createModIndex(mod, foundIndex);
}
