"use client";
import React, { useEffect, useState } from "react";
import type { timetable } from "@prisma/client";
import { ComboBoxPro } from "./ComboBoxPro";
import { Button } from "./ui/button";
import { Save, Trash2 } from "lucide-react";
import {
  addTimetable,
  deleteTimetable,
  editTimetable,
} from "@/actions/timetable";
import Link from "next/link";
import { useTimetableStore } from "@/stores/useTimetableStore";
import { useUserTimetables } from "@/context/TimetableContexts";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

const UserTimetableSelect = () => {
  const router = useRouter();
  const [timetables, setTimetables] = useState<timetable[]>([]);
  const modIndexesBasic = useTimetableStore((state) => state.modIndexesBasic);
  const [selectedTimetable, setSelectedTimetable] = useState<timetable | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const userTimetables = useUserTimetables();
  useEffect(() => {
    setTimetables(userTimetables);
  }, [userTimetables]);
  return (
    <>
      <div className="flex flex-col items-start justify-start w-full mt-4 gap-4">
        <div className="flex flex-row gap-2">
          <ComboBoxPro
            className="w-fit min-w-64"
            options={timetables.map((timetable) => ({
              value: timetable.name,
              label: timetable.name,
            }))}
            placeholder="Select or Create Timetable"
            selected={selectedTimetable ? selectedTimetable.name : ""}
            onChange={(option) => {
              const selected = timetables.find(
                (timetable) => timetable.name === option.label
              );
              setSelectedTimetable(selected || null);
            }}
            onCreate={async (value) => {
              setLoading(true);
              const newTimetable = await addTimetable(value, modIndexesBasic);
              setTimetables((prev) => [...prev, newTimetable]);
              setSelectedTimetable(newTimetable);
              setLoading(false);
              router.push(`/plan/?timetableId=${newTimetable.id}`);
            }}
          />
          {loading && <Spinner />}
        </div>
        {selectedTimetable && (
          <div className="flex items-center gap-1">
            <Link href={`/plan/?timetableId=${selectedTimetable.id}`}>
              <Button variant="outline">Open</Button>
            </Link>
            <Button
              onClick={async () => {
                await editTimetable(selectedTimetable.id, modIndexesBasic);
              }}
            >
              <Save />
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                setLoading(true);
                await deleteTimetable(selectedTimetable.id);
                setTimetables((prev) =>
                  prev.filter(
                    (timetable) => timetable.id !== selectedTimetable.id
                  )
                );
                setSelectedTimetable(null);
                setLoading(false);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserTimetableSelect;
