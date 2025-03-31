"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../auth";

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function addTimetable(formData: FormData) {
  console.log(formData); return;
  const timetableName = formData.get("timetableName") as string;
  const courseCode = formData.get("courseCode") as string;
  const index = formData.get("index") as string;
  const indexes = [{ courseCode, index }];
  const session = await auth();
  const userId = session?.user?.id as string;
  try {
    // Create a new timetable entry in the database
    const newTimetable = await prisma.timetable.create({
      data: {
        name: timetableName,
        modindexes: indexes,
        userId: userId,
      },
    });

    return newTimetable; // Return the created timetable entry
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw new Error("Error adding timetable");
  }
}
