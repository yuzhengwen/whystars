"use client";
import { IIndex, IMod } from "@/lib/models/modModel";
import React, { useEffect, useState } from "react";
import { ComboboxDemo } from "./ui/combobox";
import { Pin, PinOff, X } from "lucide-react";
import { ColorPicker } from "./ColorPicker";
import { useModColorStore } from "@/stores/useModColorStore";
import { useConstraintsStore } from "@/stores/useConstraintsStore";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { solids } from "@/lib/constants";
interface ModListItemProps {
  mod: IMod;
  onIndexChange: (mod: IMod, newIndex: string) => void;
  onRemove: (mod: IMod) => void;
  defaultIndex?: string;
}

// in react dev mode, each component is rendered twice, thus incrementing the color index twice
// this is ok in production
let currentSolidIndex = 0;
export const getNextSolid = () => {
  const color = solids[currentSolidIndex % solids.length];
  currentSolidIndex++;
  return color;
};

const ModListItem: React.FC<ModListItemProps> = ({
  mod,
  onIndexChange,
  onRemove,
  defaultIndex,
}) => {
  // lock
  const [locked, setLocked] = useState(false);
  const toggleLocked = useConstraintsStore((state) => state.toggleLocked);
  useEffect(() => {
    toggleLocked(mod.course_code, locked);
  }, [locked, mod.course_code, toggleLocked]);

  // color
  const [background, setBackground] = useState(getNextSolid);
  const setModColor = useModColorStore((state) => state.setModColor);
  useEffect(() => {
    setModColor(mod.course_code, background);
    console.log(`Setting color for ${mod.course_code} to ${background}`);
  }, [mod.course_code, background, setModColor]);

  return (
    <div className="flex flex-col items-start w-full p-4 border-b-2">
      <div className="flex w-full justify-between items-start">
        <span>{mod.course_name}</span>
        <X
          className="cursor-pointer flex-shrink-0"
          onClick={() => onRemove(mod)}
        />
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
        <Tooltip>
          <TooltipTrigger>
            <div onClick={() => setLocked(!locked)} className="cursor-pointer">
              {locked ? <Pin /> : <PinOff />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Lock this index for timetable generation</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ModListItem;
