"use client";
import AddTimetable from "@/components/AddTimetable";
import { Button } from "@/components/ui/button";
import { askAI } from "@/lib/gemini";
import React from "react";

export default function Home() {
  const [response, setResponse] = React.useState<string | null>("");
  async function handleTest() {
    const aiResponse = await askAI(["SC2008", "SC2005", "SC2104"]); // Call the server action
    setResponse(aiResponse);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Plan</h1>
      <p className="mt-4 text-lg">This is the plan page.</p>
      <Button onClick={handleTest}>Test AI</Button>
      {response && <p className="mt-4 text-lg">AI Response: {response}</p>}

      <AddTimetable />
    </div>
  );
}
