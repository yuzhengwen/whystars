"use server";
import { cache } from "react";

export async function getMods(courseCodes: string[] | undefined) {
  /*await connectDB();
  const mods = await Mod.find({ course_code: { $in: courseCodes } }).exec();*/
  const mods = courseCodes
    ? await Promise.all(
        courseCodes.map(async (courseCode) => {
          return await getMod(courseCode);
        })
      )
    : undefined;
  if (!mods) {
    throw new Error("No mods found");
  }
  return mods;
}
export const getMod = cache(async (courseCode: string) => {
  console.log("Fetching at ", `data/mods/${courseCode}.json`);
  const res = await fetch(`data/mods/${courseCode}.json`);
  const data = await res.json();
  if (!data) {
    throw new Error("No mod found");
  }
  return data;
});
