"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { askAI } from "@/lib/gemini";

const AiButton = () => {
  const [response, setResponse] = React.useState<string | null>("");
  async function handleTest() {
    const aiResponse = await askAI(["SC2008", "SC2005", "SC2104"]); // Call the server action
    setResponse(aiResponse);
  }
  return (
    <div>
      <Button onClick={handleTest}>Test AI</Button>
      {response && <p className="mt-4 text-lg">AI Response: {response}</p>}
    </div>
  );
};

export default AiButton;
