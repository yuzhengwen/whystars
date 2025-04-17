"use client";
import React from "react";
import DayConfigInput from "./DayConfig";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useConstraintsStore } from "@/stores/useConstraintsStore";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

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
      <Tooltip>
        <TooltipTrigger>
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
        </TooltipTrigger>
        <TooltipContent>
          <p>
            Timetables generated will not have lessons in these timings
          </p>
        </TooltipContent>
      </Tooltip>
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
