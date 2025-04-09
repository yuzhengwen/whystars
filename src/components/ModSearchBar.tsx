"use client";
import * as React from "react";
import { useEffect } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "cmdk";
import { ModInfoBasic } from "@/types/modtypes";
import { baseUrl } from "@/lib/baseUrl";

const ModSearchBar = ({
  onSelect,
  selectedStrings,
}: {
  onSelect: (mod: ModInfoBasic) => void;
  selectedStrings: string[];
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const [mods, setMods] = React.useState<ModInfoBasic[]>([]);
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [onScrollbar, setOnScrollbar] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current &&
      !inputRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      inputRef.current.blur();
    }
  };
  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchend", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [open]);
  useEffect(() => {
    setOpen(searchValue.length > 0);
  }, [searchValue]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${baseUrl}/data/module_list.json`);
      const data: ModInfoBasic[] = await res.json();
      setMods(data);
    };
    fetchData();
  }, []);
  const handleSelect = (mod: ModInfoBasic) => {
    setSearchValue("");
    onSelect(mod);
  };

  const filteredMods = mods.filter(
    (mod) =>
      mod.course_name.toLowerCase().includes(searchValue.toLowerCase()) ||
      mod.course_code.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="max-w-md w-full">
      <Command
        className="h-auto overflow-visible bg-transparent"
        ref={dropdownRef}
      >
        <CommandInput
          value={searchValue}
          onValueChange={setSearchValue}
          placeholder="Search for a module..."
          className="border p-2 w-full rounded"
          ref={inputRef}
          onBlur={() => {
            if (!onScrollbar) {
              setOpen(false);
            }
          }}
          onFocus={() => {
            setOpen(true);
          }}
        />
        <div className="relative">
          {open && (
            <CommandList
              onMouseLeave={() => {
                setOnScrollbar(false);
              }}
              onMouseEnter={() => {
                setOnScrollbar(true);
              }}
              onMouseUp={() => {
                inputRef?.current?.focus();
              }}
              className="max-h-60 overflow-y-auto absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
            >
              {filteredMods.length > 0 ? (
                <CommandGroup
                  heading="Modules"
                  className="h-full overflow-auto"
                >
                  {filteredMods.map((mod) => (
                    <CommandItem
                      key={mod.course_code}
                      onSelect={() => handleSelect(mod)}
                      className={`cursor-pointer px-2 py-1.5 rounded-md hover:bg-muted transition-all truncate ${
                        selectedStrings.includes(mod.course_code)
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                      value={mod.course_code + " " + mod.course_name}
                      disabled={selectedStrings.includes(mod.course_code)}
                    >
                      <div>
                        <span className="font-semibold">{mod.course_code}</span>{" "}
                        - {mod.course_name}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          )}
        </div>
      </Command>
    </div>
  );
};

export default ModSearchBar;
