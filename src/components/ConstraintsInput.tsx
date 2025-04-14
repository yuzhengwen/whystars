"use client";
import React from "react";
import DayConfigInput from "./constraint-inputs/DayConfig";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useConstraintsStore } from "@/stores/useConstraintsStore";

export type DayConfig = {
  day: string;
  startTime: string;
  endTime: string;
  avoidDay: boolean;
};
const ConstraintsInput = () => {
  const { dayConfigs, addDayConfig, removeDayConfig } = useConstraintsStore();
  return (
    <div className="flex flex-col gap-4 mt-4">
      <Button
      className="w-fit"
      variant={"outline"}
        onClick={() => {
          addDayConfig({
            day: "",
            startTime: "",
            endTime: "",
            avoidDay: false,
          });
        }}
      >
        Add Blacklist Timing
      </Button>
      {dayConfigs.map((config, index) => (
        <div key={index} className="flex flex-row gap-2 mb-4">
          <DayConfigInput key={index} index={index} />
          <Button
            variant="ghost"
            onClick={() => {
              removeDayConfig(index);
            }}
          >
            <X />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ConstraintsInput;
