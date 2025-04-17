import React from "react";
import { fetchModList } from "@/actions/getMods";
import Link from "next/link";
import { ModInfoBasic } from "@/types/modtypes";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
} from "lucide-react";

type Props = {
  query: string;
  page: string;
};

const PAGE_SIZE = 15;
const PaginatedMods = async ({ query, page }: Props) => {
  const currentPage = Math.max(1, parseInt(page));
  const data = await fetchModList(); // Fetch mod list data (server action)

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
      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-2">
        <div
          className="flex gap-1"
          style={{ visibility: currentPage > 1 ? "visible" : "hidden" }}
        >
          <Link href={`?query=${query}&page=1`}>
            <Button variant={"ghost"}>
              <ArrowLeftToLine color="gray" />
            </Button>
          </Link>
          <Link href={`?query=${query}&page=${currentPage - 1}`}>
            <Button variant={"ghost"}>
              <ArrowLeft color="gray" />
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div
          className="flex gap-1"
          style={{
            visibility: currentPage < totalPages ? "visible" : "hidden",
          }}
        >
          <Link href={`?query=${query}&page=${currentPage + 1}`}>
            <Button variant={"ghost"}>
              <ArrowRight color="gray" />
            </Button>
          </Link>
          <Link href={`?query=${query}&page=${totalPages}`}>
            <Button variant={"ghost"}>
              <ArrowRightToLine color="gray" />
            </Button>
          </Link>
        </div>
      </div>

      <section className="flex flex-col items-center justify-start">
        <ul className="mt-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3 px-2 md:px-24 w-full">
          {paginated.map((mod: ModInfoBasic) => (
            <li key={mod.course_code}>
              <Link
                href={`/mods/${mod.course_code}`}
                className="flex flex-col items-center justify-center bg-card shadow-md rounded-md p-3 hover:shadow-lg w-full h-full transition-all duration-300 hover:bg-hover"
              >
                <span className="text-lg overflow-ellipsis text-center">
                  {mod.course_name}
                </span>
                <p className="text-gray-600">{mod.course_code}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default PaginatedMods;
