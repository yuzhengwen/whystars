"use client";
import { addTimetable } from "@/actions/timetable";

const SaveTimetable = () => {
  const handleSubmit = async (formData: FormData) => {
    await addTimetable(formData);
  };
  return (
    <>
      <form action={handleSubmit}>
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
          Save Timetable
        </button>
      </form>
    </>
  );
};

export default SaveTimetable;
