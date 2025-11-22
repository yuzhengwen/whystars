"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "../app/auth";
import { ModIndexBasic } from "@/types/modtypes";
import { Prisma, timetable } from "@prisma/client";

export async function getAllUsers() {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const users = await prisma.user.findMany();
  return users;
}

export async function addTimetable(
  timetableName: string,
  modIndexes: ModIndexBasic[]
): Promise<timetable> {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  try {
    // Create a new timetable entry in the database
    const created = await prisma.timetable.create({
      data: {
        name: timetableName,
        modindexes: modIndexes as unknown as Prisma.InputJsonArray, // somehow it works
        userId: userId,
      },
    });
    return created;
  } catch (error) {
    console.error("Error adding timetable:", error);
    throw new Error("Error adding timetable");
  }
}
export async function deleteTimetable(timetableId: number) {
  const session = await auth();
  if (!session || !session.user) {
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
export async function editTimetable(
  timetableId: number,
  modIndexes: ModIndexBasic[]
) {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  try {
    // Update the timetable entry in the database
    const updated =await prisma.timetable.update({
      where: {
        id: timetableId,
        userId: userId,
      },
      data: {
        modindexes: modIndexes as unknown as Prisma.InputJsonArray, // somehow it works
      },
    });
    return updated;
  } catch (error) {
    console.error("Error editing timetable:", error);
    throw new Error("Error editing timetable");
  }
}
export async function getUserTimetables(): Promise<timetable[]> {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  try {
    const timetables = await prisma.timetable.findMany({
      where: {
        userId: userId,
      },
    });
    return timetables;
  } catch (error) {
    console.error("Error fetching user timetables:", error);
    throw new Error("Error fetching user timetables");
  }
}
export async function getTimetableById(
  timetableId: string
): Promise<timetable | null> {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  const userId = session?.user?.id as string;
  try {
    const timetable = await prisma.timetable.findUnique({
      where: {
        id: parseInt(timetableId),
        userId: userId,
      },
    });
    return timetable;
  } catch (error) {
    console.error("Error fetching timetable by ID:", error);
    throw new Error("Error fetching timetable by ID");
  }
}
