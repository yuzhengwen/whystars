"use client";
import { X } from "lucide-react";
import Link from "next/link";
// This component is a client-side component that resets the form when clicked
// and is used in the SearchForm component. It uses the `use client` directive to indicate that it should be rendered on the client side.
import React from "react";

const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector(".form") as HTMLFormElement;
    if (form) form.reset();
  };
  return (
    <button
      onClick={reset}
      type="reset"
      className="bg-gray-500 text-white rounded px-4 py-2"
    >
      <Link href="/mods" className="text-white">
        <X className="w-5 h-5" />
      </Link>
    </button>
  );
};

export default SearchFormReset;
