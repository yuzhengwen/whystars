
export interface ILesson {
  lesson_type: string;
  group: string;
  day: string;
  time: string;
  venue: string;
  remark: string;
}

export interface IIndex {
  index: string;
  lessons: ILesson[];
}

export interface IMod extends Document {
  course_code: string;
  course_name: string;
  academic_units: number;
  indexes: IIndex[];
}