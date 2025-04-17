"use client";
import { IMod } from "@/lib/models/modModel";
import React from "react";
import { Button } from "./ui/button";
import { useTimetableStore } from "@/stores/useTimetableStore";
import { useRouter } from "next/navigation";

const AddModButton = ({ mod }: { mod: IMod }) => {
  const setCourseIndex = useTimetableStore((state) => state.setCourseIndex);
  const router = useRouter();
  const handleClick = () => {
    setCourseIndex(mod.course_code, mod.course_name, mod.indexes[0].index);
    router.push("/plan");
  };
  return (
    <Button className="w-fit" onClick={handleClick}>
      Add to Timetable
    </Button>
  );
};

export default AddModButton;
