"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Paintbrush } from "lucide-react";
import { useState } from "react";

export function PickerExample() {
  const [background, setBackground] = useState("#B4D455");

  return (
    <div
      className="w-full h-full preview flex min-h-[350px] justify-center p-10 items-center rounded !bg-cover !bg-center transition-all"
      style={{ background }}
    >
      <ColorPicker background={background} setBackground={setBackground} />
    </div>
  );
}

export function ColorPicker({
  background,
  setBackground,
  className,
}: {
  background: string;
  setBackground: (background: string) => void;
  className?: string;
}) {
  const solids = [
    "#c82461",
    "#B5179E",
    "#480CA8",
    "#3F37C9",
    "#1b998b",
    "#3da5d9",
    "#7dcfb6",
    "#09203f",
  ];
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          className={cn(
            "justify-start text-left font-normal",
            !background && "text-muted-foreground",
            className
          )}
        >
          <div className="w-full flex items-center gap-2">
            {background ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background }}
              ></div>
            ) : (
              <Paintbrush className="h-4 w-4" />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit grid grid-cols-4 gap-2 p-2">
        {solids.map((s) => (
          <div
            key={s}
            style={{ background: s }}
            className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
            onClick={() => {
              setBackground(s);
              setOpen(false);
            }}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
