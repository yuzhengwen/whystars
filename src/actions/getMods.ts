"use server";
import { baseUrl } from "@/lib/baseUrl";
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
  const res = await fetch(`${baseUrl}/data/mods/${courseCode}.json`);
  const data = await res.json();
  if (!data) {
    throw new Error("No mod found");
  }
  return data;
});
