"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../auth";
import { ModIndex, modIndexToSimple } from "@/types/modtypes";

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function addTimetable(formData: FormData, modIndexes: ModIndex[]) {
  const timetableName = formData.get("timetableName") as string;

  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  const modIndexesSimple = modIndexes.map((i) => modIndexToSimple(i)); // Convert mod indexes to a simpler format
  try {
    // Create a new timetable entry in the database
    await prisma.timetable.create({
      data: {
        name: timetableName,
        modindexes: JSON.stringify(modIndexesSimple), // Store mod indexes as JSON
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw new Error("Error adding timetable");
  }
}
