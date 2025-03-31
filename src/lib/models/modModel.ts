import mongoose, { Document, Model, Schema } from "mongoose";

interface ILesson {
  lesson_type: string;
  group: string;
  day: string;
  time: string;
  venue: string;
  remark: string;
}

interface IIndex {
  index: string;
  lessons: ILesson[];
}

export interface IMod extends Document {
  course_code: string;
  course_name: string;
  academic_units: number;
  indexes: IIndex[];
}

const lessonSchema = new Schema<ILesson>({
  lesson_type: { type: String, required: true },
  group: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  remark: { type: String, required: true },
});

const indexSchema = new Schema<IIndex>({
  index: { type: String, required: true },
  lessons: [lessonSchema], // Embed lessonSchema
});

const modSchema = new Schema<IMod>({
  course_code: { type: String, required: true },
  course_name: { type: String, required: true },
  academic_units: { type: Number, required: true }, // Ensure this is a number
  indexes: [indexSchema], // Embed indexSchema
});

// Create Model
const Mod: Model<IMod> =
  mongoose.models.Mod || mongoose.model<IMod>("Mod", modSchema, "mods");

export default Mod;
