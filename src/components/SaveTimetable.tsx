"use client";
import { addTimetable } from "@/actions/timetable";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTimetableStore } from "@/stores/useTimetableStore";

const SaveTimetable = () => {
  const [saving, setSaving] = useState(false);
  const { modIndexesBasic } = useTimetableStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    setSaving(true);
    try {
      await addTimetable(formData, modIndexesBasic);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full p-2">
      <h1 className="text-xl font-semibold">Save New Timetable</h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <div className="flex gap-3 items-center justify-center w-full">
          <Input
            type="text"
            name="timetableName"
            placeholder="Enter Name"
            required
            className="p-2 border rounded"
          />
          <Button type="submit" className="w-fit">
            Save
          </Button>
        </div>
        {saving && <span>Saving...</span>}
        <p className="mt-2 text-sm text-gray-500">
          This will save the current timetable to your account.
        </p>
      </form>
    </div>
  );
};

export default SaveTimetable;
