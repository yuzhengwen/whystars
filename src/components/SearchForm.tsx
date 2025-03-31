import React from "react";
import Form from "next/form";
import SearchFormReset from "./SearchFormReset";
import { Search } from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form action="/mods" className="flex items-center form">
      {/* On submit, the form will be sent to the /mods route with the query parameter */}
      <input
        name="query"
        placeholder="Search..."
        className="border border-gray-300 rounded-l px-4 py-2"
        defaultValue={query}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          <Search className="w-5 h-5" />
        </button>
        {query && <SearchFormReset />}
      </div>
    </Form>
  );
};

export default SearchForm;
