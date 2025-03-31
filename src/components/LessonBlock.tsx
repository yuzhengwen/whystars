"use client";
import React from "react";
import { ModLesson } from "./TimetableDiv";

const LessonBlock = ({
  lesson,
  top,
  height,
}: {
  lesson: ModLesson;
  top: number;
  height: number;
}) => {
  return (
    <div
      className="absolute w-full bg-blue-800 text-white rounded-md text-center p-1 hover:bg-blue-700 transition-all duration-200 ease-in-out"
      style={{
        top: `${top}rem`,
        height: `${height - 0.8}rem`,
      }}
      onClick={()=>console.log(`Clicked on ${lesson.courseCode}`)}
    >
      {lesson.courseCode}
    </div>
  );
};

export default LessonBlock;
