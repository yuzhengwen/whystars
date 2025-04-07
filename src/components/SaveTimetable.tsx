"use client";
import { addTimetable } from "@/actions/timetable";
import { ModIndex } from "@/types/modtypes";
import { useState } from "react";

const SaveTimetable = ({ modIndexes }: { modIndexes: ModIndex[] }) => {
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    e.preventDefault();
    setSaving(true);
    try {
      await addTimetable(formData, modIndexes);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 border rounded shadow-md m-5">
      <h1 className="text-2xl font-bold">Save Timetable</h1>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4">
        <input
          type="text"
          name="timetableName"
          placeholder="Enter Name"
          required
          className="p-2 mt-2 border rounded"
        />
        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
        {saving && <span>Saving...</span>}
        <p className="mt-2 text-sm text-gray-500">
          This will save the current timetable to your account.
        </p>
      </form>
    </div>
  );
};

export default SaveTimetable;
