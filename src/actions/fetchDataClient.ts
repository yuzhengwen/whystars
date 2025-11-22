"use client";
//import { baseUrl } from "@/lib/baseUrl";
import { ModInfoBasic } from "@/types/modtypes";

let modListCache: ModInfoBasic[] = []; // Cache for mod list
export async function fetchModList(): Promise<ModInfoBasic[]> {
  if (modListCache && modListCache.length > 0) return modListCache;
  try {
    // cache semester info for 8 hours
    const semRes = await fetch(`${process.env.DATA_BASE_URL}/latest.txt`, {
      cache: "force-cache",
      next: { revalidate: 28800 }, // 8 hours
    });
    const sem: string = await semRes.text();
    const res = await fetch(
      `${process.env.DATA_BASE_URL}/${sem}/module_list.json`
    );
    const data = await res.json();
    modListCache = [...data]; // Cache the fetched data
    return data;
  } catch (error) {
    console.error("Error fetching mod list:", error);
    throw new Error("Failed to fetch mod list");
  }
}
