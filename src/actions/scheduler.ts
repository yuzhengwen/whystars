"use server";

import { isOverlap } from "@/lib/dates";
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
    const indexesFound: string[] = [];
    mod.indexes.forEach((index) => {
      indexesFound.push(index.index);
    });
    console.log("Indexes found:", indexesFound.join(", "));
  });

  const overlap = isOverlap(
    mods[0].indexes[0].lessons[0],
    mods[1].indexes[0].lessons[0]
  );
  console.log("Overlap:", overlap);

  return mods;
}
