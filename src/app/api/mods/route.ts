"use server";
import { NextResponse } from "next/server";
import Mod from "@/lib/models/modModel";
import connectDB from "@/lib/mongodb"; // Adjust the import path as necessary

export const GET = async () => {
  try {
    await connectDB();
    const mods = await Mod.find({}, 'course_name course_code').limit(200); // Fetching only 10 mods for performance
    return NextResponse.json(mods);
  } catch (error) {
    console.error("Error fetching mods:", error);
    throw new Error("Failed to fetch mods");
  }
};
