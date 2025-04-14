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
import { useTimetableStore } from "@/stores/useTimetableStore";
import { useUserTimetables } from "@/context/TimetableContexts";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

const UserTimetableSelect = () => {
  // currentTimetable represents global state
  const {setCurrentTimetable, modIndexesBasic} = useTimetableStore();
  const router = useRouter();
  const [timetables, setTimetables] = useState<timetable[]>([]);
  // selectedTimetable represents local state in selectbox
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
              setCurrentTimetable(newTimetable);
              setLoading(false);
              router.replace(`/plan/?timetableId=${newTimetable.id}`);
            }}
          />
          {loading && <Spinner />}
        </div>
        {selectedTimetable && (
          <div className="flex items-center gap-1">
            <Button
              onClick={() => {
                router.replace(`/plan/?timetableId=${selectedTimetable.id}`);
              }}
              variant="outline"
            >
              Open
            </Button>
            <Button
              onClick={async () => {
                setLoading(true);
                const updated = await editTimetable(
                  selectedTimetable.id,
                  modIndexesBasic
                );
                setTimetables((prev) =>
                  prev.map((timetable) =>
                    timetable.id === selectedTimetable.id ? updated : timetable
                  )
                );
                setSelectedTimetable(updated);
                setCurrentTimetable(updated);
                setLoading(false);
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
                setLoading(false);
                setSelectedTimetable(null);
                setCurrentTimetable(null);
                router.replace("/plan");
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
