import SearchForm from "@/components/SearchForm";
import React from "react";
import Link from "next/link";
import { MinimalMod } from "@/types/modtypes";
import fs from "fs";
import path from "path";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 15; // You can tweak this

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) => {
  const { query = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page));

  let data: MinimalMod[] = [];

  try {
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

  // Filter mods based on the query (case insensitive)
  const filtered = data.filter(
    (mod) =>
      mod.course_name.toLowerCase().includes(query.toLowerCase()) ||
      mod.course_code.toLowerCase().includes(query.toLowerCase())
  );

  const totalResults = filtered.length;
  const totalPages = Math.ceil(totalResults / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <section className="flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mb-4">Find Mods</h1>
        <SearchForm />
      </section>
      <section className="flex flex-col items-center justify-start mt-4">
        <p className="text-30-semibold mb-2">
          {query ? `Searching for "${query}"` : "All mods"}
        </p>
        <ul className="mt-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          {paginated.map((mod: MinimalMod) => (
            <li key={mod.course_code}>
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

        {/* Pagination Controls */}
        <div className="flex mt-6 gap-4">
          {currentPage > 1 && (
            <>
              <Link href={`?query=${query}&page=1`}>
                <Button>{"<<"}</Button>
              </Link>
              <Link href={`?query=${query}&page=${currentPage - 1}`}>
                <Button>Previous</Button>
              </Link>
            </>
          )}
          {currentPage < totalPages && (
            <>
              <Link href={`?query=${query}&page=${currentPage + 1}`}>
                <Button>Next</Button>
              </Link>
              <Link href={`?query=${query}&page=${totalPages}`}>
                <Button>{">>"}</Button>
              </Link>
            </>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Page {currentPage} of {totalPages}
        </p>
      </section>
    </>
  );
};

export default page;
