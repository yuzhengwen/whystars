"use client";
import React from "react";
import { ModIndexBasic, ModLesson } from "@/types/modtypes";
import { useModColorStore } from "@/stores/useModColorStore";
import { useShallow } from "zustand/shallow";
import { useInteractivityStore } from "@/stores/useInteractivityStore";

const minLessonBlockWidth = 6; // Minimum width for LessonBlock
const LessonBlock = ({
  lesson,
  top,
  height,
  onClick,
  hovered,
  selected,
}: {
  lesson: ModLesson;
  top: number;
  height: number;
  onClick: (lesson: ModLesson) => void;
  hovered: boolean;
  selected: ModIndexBasic | null;
}) => {
  const { setHoveredMod } = useInteractivityStore(
    useShallow((state) => ({
      setHoveredMod: state.setHoveredMod,
    }))
  );
  const color = useModColorStore(
    (state) => state.modColors[lesson.courseCode] || "blue"
  );
  // faded color if selection ongoing & lesson is same course as selected but diff index
  return (
    <div
      className={`${
        selected &&
        selected.courseCode === lesson.courseCode &&
        selected.index !== lesson.index
          ? "opacity-50"
          : ""
      } text-white rounded-md text-center p-1 hover:opacity-80 hover:cursor-pointer transition-all duration-200 z-50`}
      style={
        {
          "--pulse-color": `${color}99`,
          marginTop: `${top}rem`,
          height: `${height}rem`,
          minWidth: `${minLessonBlockWidth}rem`,
          backgroundColor: color,
          animation: hovered ? "pulse 0.8s infinite" : "none",
        } as React.CSSProperties
      }
      onMouseEnter={() => setHoveredMod(lesson.courseCode)}
      onMouseLeave={() => setHoveredMod("")}
      onClick={() => {
        setHoveredMod("");
        onClick(lesson);
      }}
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
