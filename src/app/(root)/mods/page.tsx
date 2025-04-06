import SearchForm from "@/components/SearchForm";
import React from "react";
import Link from "next/link";
import { MinimalMod } from "@/types/modtypes";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  // get list of mods from api
  const res = await fetch("http://localhost:3000/data/module_list.json");
  const data: MinimalMod[] = await res.json();
  console.log(data[0]);
  const query = (await searchParams).query || "";
  return (
    <>
      <section className="flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mb-4">Find Mods</h1>
        <SearchForm query={query} />
      </section>
      <section className="flex flex-col items-center justify-startmt-4">
        <p className="text-30-semibold">
          {query ? `Searching for "${query}"` : "All mods"}
        </p>
        <ul className="mt-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {data.map((mod: MinimalMod) => (
            <li key={mod.course_code as string} className="">
              <Link
                href={`/mods/${mod.course_code}`}
                className="flex flex-col items-center justify-center bg-accent shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-bold">{mod.course_name}</h2>
                <p className="text-gray-600">{mod.course_code}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default page;
