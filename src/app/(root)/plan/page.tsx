import { auth } from "../../../../auth";
import { timetable } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TimetableContextWrapper from "@/components/TimetableContextWrapper";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ timetableId?: string }>;
}) {
  const session = await auth();
  const { timetableId } = await searchParams;
  let userTimetables: timetable[] = [];
  let timetable: timetable | null = null;

  if (timetableId) {
    if (!session || !session.user) redirect("/plan");
    timetable = await prisma.timetable.findUnique({
      where: {
        id: parseInt(timetableId || ""),
        userId: session.user.id,
      },
    });
  }
  if (session && session.user) {
    userTimetables = await prisma.timetable.findMany({
      where: {
        userId: session.user.id,
      },
    });
  }
  return <TimetableContextWrapper initialTimetable={timetable} userTimetables={userTimetables} />;
}
