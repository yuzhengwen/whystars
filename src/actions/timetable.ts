"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../auth";
import { ModIndexBasic } from "@/types/modtypes";

export async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

export async function addTimetable(
  formData: FormData,
  modIndexes: ModIndexBasic[]
) {
  const timetableName = formData.get("timetableName") as string;

  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  try {
    // Create a new timetable entry in the database
    await prisma.timetable.create({
      data: {
        name: timetableName,
        modindexes: modIndexes, // somehow it works
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw new Error("Error adding timetable");
  }
}
export async function deleteTimetable(timetableId: number) {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  try {
    // Delete the timetable entry from the database
    await prisma.timetable.delete({
      where: {
        id: timetableId,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw new Error("Error deleting timetable");
  }
}
