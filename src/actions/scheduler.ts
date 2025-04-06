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
  // printing for debugging
  mods.forEach((mod) => {
    console.log("Mod found:", mod.course_code, mod.course_name);
    const indexesFound: string[] = [];
    mod.indexes.forEach((index) => {
      indexesFound.push(index.index);
    });
    console.log("Indexes found:", indexesFound.join(", "));
  });
  /*
  const overlap = isOverlap(
    mods[0].indexes[0].lessons[0],
    mods[1].indexes[0].lessons[0]
  );
  console.log("Overlap:", overlap);*/

  return mods;
}
export const getMod = cache(async (courseCode: string) => {
  console.log(
    "Fetching at ",
    `http://localhost:3000/data/mods/${courseCode}.json`
  );
  const res = await fetch(`http://localhost:3000/data/mods/${courseCode}.json`);
  const data = await res.json();
  if (!data) {
    throw new Error("No mod found");
  }
  return data;
});
