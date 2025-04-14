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
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant={"secondary"}
              onClick={() => {
                if (index > 0) {
                  setIndex(index - 1);
                  setIndexInput(index + ""); // remember display is always index+1, thus this is index-1+1
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

            {
              <>
                <input
                  className="w-8 text-center p-1"
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    const inputValue = e.currentTarget.value.trim();
                    const inputIndex = parseInt(e.currentTarget.value, 10) - 1;
                    if (!inputValue || inputValue === "" || isNaN(inputIndex)) {
                      alert("Please enter a valid number");
                      return;
                    }
                    if (inputIndex >= 0 && inputIndex < schedules.length) {
                      setIndex(inputIndex);
                      schedules[inputIndex].forEach((schedule) => {
                        setCourseIndex(
                          schedule.courseCode,
                          schedule.courseName,
                          schedule.index
                        );
                      });
                    } else {
                      alert("Index out of range");
                    }
                  }}
                  onChange={(e) => {
                    setIndexInput(e.currentTarget.value);
                  }}
                  type="text"
                  defaultValue={`${index + 1}`}
                  value={indexInput}
                />
                {`/ ${schedules.length}`}
              </>
            }
            <Button
              variant={"secondary"}
              onClick={() => {
                if (index < schedules.length - 1) {
                  setIndex(index + 1);
                  setIndexInput(`${index + 2}`);
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
