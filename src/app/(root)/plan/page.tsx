import { schedule } from "@/actions/scheduler";
import AddTimetable from "@/components/AddTimetable";
import AiButton from "@/components/AiButton";
import TimetableDiv from "@/components/TimetableDiv";
import { IMod } from "@/lib/models/modModel";
import React from "react";

export default async function Home() {
  const mods = await schedule(["SC2008", "SC2005", "SC2104", "MH1812"]);
  // for testing we just use the first index
  const modIndexes = mods.map((mod: IMod) => {
    return {
      courseName: mod.course_name,
      courseCode: mod.course_code,
      index: mod.indexes[0].index,
      lessons: mod.indexes[0].lessons,
    };
  });
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Plan</h1>
      <p className="mt-4 text-lg">This is the plan page.</p>
      <AiButton />

      <AddTimetable />

      <TimetableDiv modIndexes={modIndexes} />
    </div>
  );
}
