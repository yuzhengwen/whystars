import PaginatedMods from "@/components/modspage/PaginatedMods";
import SearchForm from "@/components/SearchForm";
import { Spinner } from "@/components/ui/spinner";
import React, { Suspense } from "react";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) => {
  const { query = "", page = "1" } = await searchParams;

  return (
    <>
      <section className="flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mb-4">Find Mods</h1>
        <h3 className="text-lg text-gray-500 mb-2"> Updated for AY2025/26</h3>
        <SearchForm />
        <p className="text-30-semibold mb-2">
          {query ? `Searching for "${query}"` : "Showing All mods"}
        </p>
      </section>
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center mt-24 gap-4">
            <Spinner size={"large"}/>
            <div>Loading Mods...</div>
          </div>
        }
      >
        <PaginatedMods query={query} page={page} />
      </Suspense>
    </>
  );
};

export default page;
