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
  const [indexInput, setIndexInput] = useState<string>("");
  const setIndexHelper = (index: number) => {
    setIndex(index);
    setIndexInput((index + 1).toString());
    schedules[index].forEach((schedule) => {
      setCourseIndex(schedule.courseCode, schedule.courseName, schedule.index);
    });
  };
  const handleGenerateSchedule = async () => {
    setLoading(true);
    const generatedSchedules = await generateSchedules(mods);
    setLoading(false);
    if (!generatedSchedules || generatedSchedules.length === 0) {
      alert("No schedules found");
      return;
    }
    setSchedules(generatedSchedules);
    setIndexHelper(0);
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
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant={"secondary"}
              onClick={() => {
                if (index > 0) setIndexHelper(index - 1);
                else setIndexHelper(schedules.length - 1);
              }}
            >
              Prev
            </Button>

            {
              <>
                <input
                  className="w-8 text-center p-1"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const inputStr = e.currentTarget.value.trim();
                    const inputIndex = parseInt(e.currentTarget.value, 10) - 1;
                    if (!inputStr || inputStr === "" || isNaN(inputIndex)) {
                      alert("Please enter a valid number");
                      return;
                    }
                    if (inputIndex >= 0 && inputIndex < schedules.length)
                      setIndexHelper(inputIndex);
                    else alert("Index out of range");
                  }}
                  onChange={(e) => {
                    setIndexInput(e.currentTarget.value);
                  }}
                  type="text"
                  value={indexInput}
                />
                {`/ ${schedules.length}`}
              </>
            }
            <Button
              variant={"secondary"}
              onClick={() => {
                if (index < schedules.length - 1) setIndexHelper(index + 1);
                else setIndexHelper(0);
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
