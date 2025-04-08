"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";

const SearchForm = () => {
  const [inputValue, setInputValue] = React.useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((query: string) => {
    console.log("searching for", query); // to test debounce
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }
    if (searchParams.get("page")) {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 500);
  const reset = () => {
    setInputValue("");
  };
  return (
    <div className="relative flex items-center justify-center mb-4  w-5/6 md:w-2xl">
      <Input
        name="search"
        placeholder="Search..."
        value={inputValue}
        className="px-4 py-5 w-full"
        onChange={(e) => {
          setInputValue(e.target.value);
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query") || ""}
      />
      {searchParams.get("query") && (
        <button onClick={reset} type="reset" className="absolute right-0 p-2">
          <Link href="/mods" className="text-white">
            <X className="w-5 h-5" />
          </Link>
        </button>
      )}
    </div>
  );
};

export default SearchForm;
