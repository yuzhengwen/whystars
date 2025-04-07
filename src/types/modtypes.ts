import { IIndex, ILesson, IMod } from "@/lib/models/modModel";

export type MinimalMod = {
  course_code: string;
  course_name: string;
  aus: number;
};
// Represents the CHOSEN mod + index
export type ModIndex = {
  courseName: string;
  courseCode: string;
  index: string;
  lessons: ILesson[];
  selected?: boolean;
};
export type ModIndexSimple = {
  courseName: string;
  courseCode: string;
  index: string;
};
export function modIndexToSimple(modIndex: ModIndex): ModIndexSimple {
  return {
    courseName: modIndex.courseName,
    courseCode: modIndex.courseCode,
    index: modIndex.index,
  };
}
// Represents the specific lesson of each mod + index
export type ModLesson = ILesson & {
  courseName: string;
  courseCode: string;
  index: string;
  rowSpan: number;
  selected?: boolean;
};
export function createModLesson(index: ModIndex, lesson: ILesson) {
  return {
    ...lesson,
    courseName: index.courseName,
    courseCode: index.courseCode,
    index: index.index,
    rowSpan: 1,
  };
}
export function createModIndex(mod: IMod, index: IIndex) {
  return {
    courseName: mod.course_name,
    courseCode: mod.course_code,
    index: index.index,
    lessons: index.lessons,
  };
}

