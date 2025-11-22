"use server";
//import { baseUrl } from "@/lib/baseUrl";
import { IMod } from "@/lib/models/modModel";
import { ModBasicInfoSchema, ModInfoBasic } from "@/types/modtypes";

// server side fetching with cache
export const fetchMod = async (courseCode: string): Promise<IMod> => {
  const sem = await getSem();
  const res = await fetch(
    `${process.env.DATA_BASE_URL}/${sem}/module_full_data.json`,
    {
      cache: "force-cache",
      next: { revalidate: 28800 }, // 8 hours
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  const mod = data.find((mod: IMod) => mod.course_code === courseCode);
  if (!mod) {
    throw new Error("No mod found");
  }
  return mod;
};
export const fetchMods = async (courseCodes: string[]): Promise<IMod[]> => {
  return Promise.all(
    courseCodes.map(async (courseCode) => {
      const res = await fetchMod(courseCode);
      return res;
    })
  );
};
export async function fetchModList(): Promise<ModInfoBasic[]> {
  try {
    const sem = await getSem();
    const res = await fetch(
      `${process.env.DATA_BASE_URL}/${sem}/module_list.json`,
      {
        cache: "force-cache",
        next: { revalidate: 28800 }, // 8 hours
      }
    );
    const rawData = await res.json();
    const data = ModBasicInfoSchema.parse(rawData);
    return data;
  } catch (error) {
    console.error("Error fetching mod list:", error);
    throw new Error("Failed to fetch mod list");
  }
}
async function getSem(): Promise<string> {
  // cache semester info for 8 hours
  const semRes = await fetch(`${process.env.DATA_BASE_URL}/latest.txt`, {
    cache: "force-cache",
    next: { revalidate: 28800 }, // 8 hours
  });
  const sem: string = await semRes.text();
  return sem;
}
