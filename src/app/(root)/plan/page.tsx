import { auth } from "../../../../auth";
import { timetable } from "@prisma/client";
import { redirect } from "next/navigation";
import TimetableContextWrapper from "@/components/TimetableContextWrapper";
import { getTimetableById, getUserTimetables } from "@/actions/timetable";
import { Suspense } from "react";
import LoadingPage from "@/components/LoadingPage";

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
      timetable = await getTimetableById(timetableId, session.user.id);
    }
  }
  if (session && session.user && session.user.id)
    userTimetables = await getUserTimetables(session.user.id);
  return (
    <Suspense fallback={<LoadingPage />}>
      <TimetableContextWrapper
        initialTimetable={timetable}
        userTimetables={userTimetables}
      />
    </Suspense>
  );
}
