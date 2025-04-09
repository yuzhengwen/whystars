import React from "react";
import { Button } from "./ui/button";
import { editTimetable } from "@/actions/timetable";
import { useTimetableStore } from "@/stores/useTimetableStore";

const SaveExistingTimetable = ({ name, id }: { name: string; id: number }) => {
  const { modIndexesBasic } = useTimetableStore();
  return (
    <div className="flex flex-col items-center justify-center w-full p-2 gap-2">
      <div className="font-semibold text-xl">{`Viewing: ${name} (${id})`}</div>
      <Button
        onClick={async () => {
          await editTimetable(id, modIndexesBasic);
        }}
      >
        Save to Current Timetable
      </Button>
    </div>
  );
};

export default SaveExistingTimetable;
