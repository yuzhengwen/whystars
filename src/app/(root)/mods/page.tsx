import SearchForm from "@/components/SearchForm";
import React from "react";
import Link from "next/link";
import { MinimalMod } from "@/types/modtypes";
import fs from "fs";
import path from "path";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) => {
  let data: MinimalMod[] = [];
  try {
    //const res = await fetch(`${baseUrl}/data/module_list.json`);
    //data = await res.json();
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "module_list.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
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
