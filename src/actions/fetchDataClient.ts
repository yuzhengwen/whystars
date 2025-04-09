"use client";
import { baseUrl } from "@/lib/baseUrl";
import { ModInfoBasic } from "@/types/modtypes";

let modListCache: ModInfoBasic[] = []; // Cache for mod list
export async function fetchModList(): Promise<ModInfoBasic[]> {
  if (modListCache && modListCache.length > 0) return modListCache;
  try {
    const res = await fetch(`${baseUrl}/data/module_list.json`);
    const data = await res.json();
    modListCache = [...data]; // Cache the fetched data
    return data;
  } catch (error) {
    console.error("Error fetching mod list:", error);
    throw new Error("Failed to fetch mod list");
  }
}
