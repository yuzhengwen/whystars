"use client";
import React from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteTimetable } from "@/actions/timetable";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Timetable {
  id: number;
  name: string;
  userId: string;
}
const UserTimetableListItem = ({ timetable }: { timetable: Timetable }) => {
  const router = useRouter();
  return (
    <div className="p-4 rounded-lg shadow-md mb-4 w-full max-w-md bg-card flex items-center">
      <span className="text-lg">{timetable.name}</span>
      <div className="flex gap-2 ml-auto">
        <Link href={`/plan/?name=${timetable.name}&id=${timetable.id}`}>
          <Button variant="outline">View Timetable</Button>
        </Link>
        <Button
          variant="destructive"
          onClick={async () => {
            await deleteTimetable(timetable.id);
            router.refresh();
          }}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default UserTimetableListItem;
