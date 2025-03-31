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
  console.log("Rendering LessonBlock:", { lesson, top, height });
  return (
    <div
      className="absolute w-full mx-auto bg-blue-500 text-white rounded-md text-center p-1 text-xs shadow-lg opacity-75"
      style={{
        top: `${top}rem`,
        height: `${height - 0.8}rem`,
      }}
    >
      {lesson.courseCode}
    </div>
  );
};

export default LessonBlock;
