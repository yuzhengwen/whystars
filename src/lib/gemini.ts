"use server";
import { getMods } from "@/actions/getMods";
// This is a server action
import { GoogleGenAI, Type } from "@google/genai";
import { IIndex } from "./models/modModel";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type FormattedMods = {
  course_code: string;
  course_name: string;
  academic_units: number;
  indexes: {
    index: string;
    lessons: {
      time: string;
      day: string;
    }[];
  }[];
};
export async function askAI(courseCodes: string[]): Promise<string> {
  const mods = await getMods(courseCodes);
  const formattedMods: FormattedMods[] = [];
  mods.forEach((mod) => {
    const formattedIndexes = mod.indexes.map((index: IIndex) => {
      return {
        index: index.index,
        lessons: index.lessons.map((lesson) => ({
          time: lesson.time,
          day: lesson.day,
        })),
      };
    });
    formattedMods.push({
      course_code: mod.course_code,
      course_name: mod.course_name,
      academic_units: mod.academic_units,
      indexes: formattedIndexes,
    });
  });
  const prompt = `You are a course planner solving a constraint satisfaction problem.
  Given a list of courses with multiple indexes, each index has a set of lessons with different times.
  Each timetable should choose exactly one index per course, and there must be no overlapping lesson times.
    
  Example of a Valid Timetable:
  [
    {
      "courseCode": "SC2005",
      "indexCode": "10272",
      "lessonTimes": "THU 1030-1220, TUE 1330-1420, MON 1030-1220"
    },
    {
      "courseCode": "SC2008",
      "indexCode": "10306",
      "lessonTimes": "WED 0930-1120, MON 1430-1520, THU 0930-1220"
    },
    {
      "courseCode": "SC2104",
      "indexCode": "10317",
      "lessonTimes": "TUE 1230-1420, WED 1330-1420, MON 0830-1120"
    }
  ]

  Example of an Invalid Timetable:
  [
    {
      "courseCode": "SC2005",
      "indexCode": "10272",
      "lessonTimes": "THU 1030-1220, TUE 1330-1420, MON 1030-1220"
    },
    {
      "courseCode": "SC2008",
      "indexCode": "10306",
      "lessonTimes": "TUE 1030-1220, THU 1130-1220, FRI 1230-1420"
    },
    {
      "courseCode": "SC2104",
      "indexCode": "10317",
      "lessonTimes": "TUE 1230-1420, WED 1330-1420, MON 0830-1120"
    }
  ]
  ❌ Conflict: SC2005 (TUE 1330-1420) overlaps with SC2104 (TUE 1230-1420).

  The user will be taking these courses ${courseCodes}.
  The course index and lesson timings: ${JSON.stringify(formattedMods)}.

  Your Task: Generate max 3 valid timetables for the following courses, ensuring that lesson times do not overlap. Check thoroughly for conflicts.
  `;
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              courseCode: {
                type: Type.STRING,
                description: "Course Code",
                nullable: false,
              },
              indexCode: {
                type: Type.STRING,
                description: "Course Index",
                nullable: false,
              },
              lessonTimes: {
                type: Type.STRING,
                description: "Lesson Times in the format DAY - TIME",
                nullable: false,
              },
            },
            required: ["courseCode", "indexCode"],
          },
        },
      },
    },
  });
  const text = response.text ?? "No response text available";

  console.log(`Prompt: ${prompt}`);
  return text;
}
