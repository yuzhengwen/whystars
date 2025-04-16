"use client";
import { IIndex, IMod } from "@/lib/models/modModel";
import React, { useEffect, useState } from "react";
import { ComboboxDemo } from "./ui/combobox";
import { X } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { useModColorStore } from "@/stores/useModColorStore";
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
  const [background, setBackground] = useState("#c82461");
  const setModColor = useModColorStore((state) => state.setModColor);
  useEffect(() => {
    setModColor(mod.course_code, background);
    console.log(`Setting color for ${mod.course_code} to ${background}`);
  }, [mod.course_code, background, setModColor]);
  return (
    <div className="flex flex-col items-start w-full p-4 border-b-2">
      <div className="flex w-full">
        <span>{mod.course_name}</span>
        <X className="ml-auto cursor-pointer" onClick={() => onRemove(mod)} />
      </div>
      <div className="mb-2">
        <span>{mod.course_code}</span>
        <span className="ml-5 text-gray-500">
          {mod.academic_units}AU{mod.academic_units > 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex items-center gap-2 w-full">
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
        <ColorPicker background={background} setBackground={setBackground} />
      </div>
    </div>
  );
};

export default ModListItem;
