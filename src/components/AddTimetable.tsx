"use client";
import { addTimetable } from "@/actions/timetable";
import SelectMods from "./SelectMods";
import { useState } from "react";
import { schedule } from "@/actions/scheduler";

const AddTimetable = () => {
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const handleModsChange = (selectedValues: string[]) =>
    setSelectedMods(selectedValues);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    // call server functions
    await schedule(selectedMods);
    await addTimetable(formData);
  };
  return (
    <form onSubmit={handleSubmit}>
      <SelectMods onChange={handleModsChange} />
      <input
        type="text"
        name="timetableName"
        placeholder="Enter Name"
        required
        className="p-2 mt-2 border rounded"
      />

      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
        Add Timetable
      </button>
    </form>
  );
};

export default AddTimetable;
