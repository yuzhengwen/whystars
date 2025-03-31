"use server";

import Mod from "@/lib/models/modModel";
import connectDB from "@/lib/mongodb";

export async function schedule(courseCodes: string[] | undefined) {
  await connectDB();
  const mods = await Mod.find({ course_code: { $in: courseCodes } }).exec();
  if (!mods) {
    throw new Error("No mods found");
  }
  mods.forEach((mod) => {
    console.log("\nMod found:", mod.course_code, mod.course_name);
    mod.indexes.forEach((index) => {
      console.log("Index found:", index.index);
      index.lessons.forEach((lesson) => {
        console.log(
          "Lesson found:",
          lesson.lesson_type,
          lesson.group,
          lesson.day,
          lesson.time,
          lesson.venue,
          lesson.remark
        );
      });
    });
  });
}
