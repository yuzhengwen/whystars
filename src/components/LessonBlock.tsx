"use client";
import React from "react";
import { ModLesson } from "@/types/modtypes";
import { useModColorStore } from "@/stores/useModColorStore";

const minLessonBlockWidth = 6; // Minimum width for LessonBlock
const LessonBlock = ({
  lesson,
  top,
  height,
  onClick,
}: {
  lesson: ModLesson;
  top: number;
  height: number;
  onClick: (lesson: ModLesson) => void;
}) => {
  const color = useModColorStore(
    (state) => state.modColors[lesson.courseCode] || "blue"
  );
  return (
    <div
      className={`${
        lesson.selected ? "" : "opacity-50"
      } text-white rounded-md text-center p-1 hover:bg-blue-700 hover:cursor-pointer transition-all duration-200 z-50`}
      style={{
        marginTop: `${top}rem`,
        height: `${height}rem`,
        minWidth: `${minLessonBlockWidth}rem`,
        backgroundColor: color,
      }}
      onClick={() => onClick(lesson)}
    >
      <div className="font-semibold text-xs">
        {lesson.courseCode}
        {lesson.index && lesson.index !== "0" && `(${lesson.index})`}
      </div>

      <div className="text-xs">
        {lesson.lesson_type} {lesson.group && `(${lesson.group})`}
      </div>
      <div className="text-xs">
        {lesson.venue && lesson.venue !== "TBA" && lesson.venue}
      </div>
      <div className="text-xs">
        {lesson.remark && lesson.remark !== "TBA" && ` - ${lesson.remark}`}
      </div>
    </div>
  );
};

export default LessonBlock;
