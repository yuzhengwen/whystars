import TimetableApp from "@/components/TimetableApp";
import { auth } from "../../../../auth";
import { timetable } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ timetableId?: string }>;
}) {
  const { timetableId } = await searchParams;
  let timetable: timetable | null = null;
  const session = await auth();
  
  if (timetableId) {
    if (!session || !session.user) {
      redirect("/plan");
    }
    timetable = await prisma.timetable.findUnique({
      where: {
        id: parseInt(timetableId || ""),
        userId: session.user.id,
      },
    });
    if (!timetable) {
      return <div>Timetable not found</div>;
    }
  }
  return (
    <>
      <TimetableApp initialTimetable={timetable} />
    </>
  );
}
