"use client";
import React from "react";
import { useCallback } from "react";
import { MoveDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NextSectionButton = ({ className }: { className?: string }) => {
  const scrollToNext = useCallback(() => {
    const sections = document.querySelectorAll("section");
    const currentScroll = window.scrollY;

    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const absoluteTop = rect.top + window.scrollY;

      if (absoluteTop > currentScroll + 10) {
        section.scrollIntoView({ behavior: "smooth" });
        break;
      }
    }
  }, []);
  return (
    <MoveDown
      size={24}
      className={cn("animate-bounce cursor-pointer", className)}
      onClick={scrollToNext}
    />
  );
};

export default NextSectionButton;
