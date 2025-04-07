"use client";
import { IIndex, IMod } from "@/lib/models/modModel";
import React from "react";
import { ComboboxDemo } from "./ui/combobox";
import { X } from "lucide-react";
interface ModListItemProps {
  mod: IMod;
  onIndexChange: (mod: IMod, newIndex: string) => void;
  onRemove: (mod: IMod) => void;
  defaultIndex?: string;
}
const ModListItem: React.FC<ModListItemProps> = ({
  mod,
  onIndexChange,
  onRemove,
  defaultIndex,
}) => {
  return (
    <div className="flex flex-col items-start w-full p-4 border-b-2">
      <div className="flex w-full">
        <span>{mod.course_name}</span>
        <X className="ml-auto cursor-pointer" onClick={() => onRemove(mod)} />
      </div>
      <div className="mb-2">
        <span>{mod.course_code}</span>
      </div>
      <div>
        <span>Index: </span>
        <ComboboxDemo
          options={mod.indexes.map((index: IIndex) => ({
            value: index.index,
            label: index.index,
          }))}
          defaultValue={defaultIndex}
          onChange={(value: string) => {
            onIndexChange(mod, value);
          }}
        />
      </div>
    </div>
  );
};

export default ModListItem;
