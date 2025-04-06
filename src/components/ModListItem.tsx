"use client";
import { IIndex, IMod } from "@/lib/models/modModel";
import React from "react";
import { ComboboxDemo } from "./ui/combobox";
interface ModListItemProps {
  mod: IMod;
  onIndexChange: (mod: IMod, newIndex: string) => void;
}
const ModListItem: React.FC<ModListItemProps> = ({ mod, onIndexChange }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full p-4 border-b-2 border-gray-200">
      <div className="flex mb-2">
        <span>{mod.course_name}</span>
      </div>
      <div>
        <span>Index: </span>
        <ComboboxDemo
          options={mod.indexes.map((index: IIndex) => ({
            value: index.index,
            label: index.index,
          }))}
          defaultValue={mod.indexes[0].index}
          onChange={(value: string) => {
            onIndexChange(mod, value);
          }}
        />
      </div>
    </div>
  );
};

export default ModListItem;
