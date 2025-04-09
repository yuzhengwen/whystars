"use server";
import { baseUrl } from "@/lib/baseUrl";
import { IMod } from "@/lib/models/modModel";

// server side fetching with cache
import { cache } from "react";
export const fetchMod = cache(async (courseCode: string): Promise<IMod> => {
  const res = await fetch(`${baseUrl}/data/mods/${courseCode}.json`);
  const data = await res.json();
  if (!data) {
    throw new Error("No mod found");
  }
  return data;
});
export const fetchMods = async (courseCodes: string[]): Promise<IMod[]> => {
  return Promise.all(
    courseCodes.map(async (courseCode) => {
      const res = await fetchMod(courseCode);
      return res;
    })
  );
};

/*
// client side function with caching
const modCache = new Map<string, IMod>();
export const fetchMod = async (courseCode: string): Promise<IMod> => {
  if (modCache.has(courseCode)) {
    return modCache.get(courseCode) as IMod;
  }
  const res = await fetch(`${baseUrl}/data/mods/${courseCode}.json`);
  const data = await res.json();
  if (!data) {
    throw new Error("No mod found");
  }
  modCache.set(courseCode, data);
  return data;
};*/

export async function fetchAllMods(courseCodes: string[] | undefined) {
  const mods = courseCodes
    ? await Promise.all(
        courseCodes.map(async (courseCode) => {
          return await fetchMod(courseCode);
        })
      )
    : undefined;
  if (!mods) {
    throw new Error("No mods found");
  }
  return mods;
}

