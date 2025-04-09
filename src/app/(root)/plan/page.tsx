"use client";

import TimetableApp from "@/components/TimetableApp";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TimetableApp />
    </Suspense>
  );
}
