"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";

function Page() {
  const [result, setResult] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setResult("Sending....");
    setLoading(true);

    const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!WEB3FORMS_ACCESS_KEY) {
      setResult("No access key found. Please contact the administrator.");
      return;
    }
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully. Thanks!");
      setLoading(false);
      form.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className="flex flex-col w-5/6 md:w-2xl gap-5 p-4 m-5">
      <h2 className="text-3xl">Leave a feedback or suggestion!</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="email">Email:</label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="(Optional) For follow up purposes"
          />
        </div>
        <div>
          <label htmlFor="type">Type:</label>
          <RadioGroup defaultValue="others" required id="type" name="type">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bug-report" id="bug-report" />
              <label htmlFor="bug-report">Bug Report</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="feature-request" id="feature-request" />
              <label htmlFor="feature-request">Feature Request</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="usage-assist" id="usage-assist" />
              <label htmlFor="usage-assist">Usage Assistance</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="others" id="others" />
              <label htmlFor="others">Others</label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <label htmlFor="title">Title:</label>
          <Input id="title" type="title" name="title" />
        </div>
        <div>
          <label htmlFor="message">Details:</label>
          <Textarea name="message" id="message" required></Textarea>
        </div>

        <Button type="submit" className="w-fit" disabled={loading}>
          Submit Form
        </Button>
      </form>
      <span className="flex flex-row items-center gap-2">
        {loading && <Spinner />}
        {result}
      </span>
    </div>
  );
}
export default Page;
