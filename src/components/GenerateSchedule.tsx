"use client";
import { generateSchedules } from "@/actions/scheduler";
import { IMod } from "@/lib/models/modModel";
import { useTimetableStore } from "@/stores/useTimetableStore";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { ModIndexBasic } from "@/types/modtypes";
import { Spinner } from "./ui/spinner";

type Props = {
  mods: IMod[];
};

const GenerateSchedule = ({ mods }: Props) => {
  const [loading, setLoading] = useState(false);
  const { setCourseIndex } = useTimetableStore();
  const [schedules, setSchedules] = useState<ModIndexBasic[][]>([]);
  const [index, setIndex] = useState<number>(0);
  const handleGenerateSchedule = async () => {
    setLoading(true);
    const generatedSchedules = await generateSchedules(mods);
    if (!generatedSchedules || generatedSchedules.length === 0) {
      setLoading(false);
      alert("No schedules found");
      return;
    }
    setSchedules(generatedSchedules);
    setIndex(0);
    generatedSchedules[0].forEach((schedule) => {
      setCourseIndex(schedule.courseCode, schedule.courseName, schedule.index);
    });
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-start justify-center w-full mt-4 gap-2 mb-4">
      <div className="flex gap-2">
        <Button onClick={handleGenerateSchedule} className="">
          Generate Schedules
        </Button>
        {loading && <Spinner />}
      </div>
      {schedules.length > 0 && (
        <div className="flex flex-col gap-2">
          <div>Valid Schedules Found: {schedules.length}</div>
          <div className="flex items-center justify-between w-full">
            <Button
              onClick={() => {
                if (index > 0) {
                  setIndex(index - 1);
                  schedules[index - 1].forEach((schedule) => {
                    setCourseIndex(
                      schedule.courseCode,
                      schedule.courseName,
                      schedule.index
                    );
                  });
                }
              }}
            >
              Prev
            </Button>
            {`${index + 1} of ${schedules.length}`}
            <Button
              onClick={() => {
                if (index < schedules.length - 1) {
                  setIndex(index + 1);
                  schedules[index + 1].forEach((schedule) => {
                    setCourseIndex(
                      schedule.courseCode,
                      schedule.courseName,
                      schedule.index
                    );
                  });
                }
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateSchedule;
