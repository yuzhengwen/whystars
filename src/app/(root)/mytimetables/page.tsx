import React from "react";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import UserTimetableListItem from "@/components/UserTimetableListItem";

const page = async () => {
  const session = await auth();
  const timetables = await prisma.timetable.findMany({
    where: { userId: session?.user?.id },
  });
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="mt-4 text-lg">
        {session?.user?.email
          ? `Welcome, ${session.user.name}`
          : "Please log in to view your timetables."}
      </p>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        <p className="text-lg">This page is still a work in progress.</p>
        <p className="text-lg">More features will be added soon!</p>
        {/* Add a list of timetables here if available */}
        {session?.user?.email && (
          <div className="flex flex-col items-center justify-center w-full mt-4">
            <h2 className="text-2xl font-bold mb-4">Your Timetables</h2>
            {/* Add your timetable list here */}
            {timetables.map((timetable) => (
              <UserTimetableListItem timetable={timetable} key={timetable.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
