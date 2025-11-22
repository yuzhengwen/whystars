import { auth } from "@/auth";
import { timetable } from "@prisma/client";
import { redirect } from "next/navigation";
import TimetableContextWrapper from "@/components/TimetableContextWrapper";
import { getTimetableById, getUserTimetables } from "@/actions/timetable";
import { Suspense } from "react";
import { fetchModList } from "@/actions/getMods";

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
    else if (session.user.id) {
      timetable = await getTimetableById(timetableId);
      if (!timetable) redirect("/plan"); // if timetable not found, redirect to /plan
    }
  }
  if (session && session.user && session.user.id)
    userTimetables = await getUserTimetables();

  const modListData = await fetchModList();

  return (
    <Suspense>
      <TimetableContextWrapper
        initialTimetable={timetable}
        userTimetables={userTimetables}
        modListData={modListData}
      />
    </Suspense>
  );
}
