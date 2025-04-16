import React from 'react'
import { useCallback } from "react";
import { MoveDown } from "lucide-react";

const NextSectionButton = () => {
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
      size={36}
      className="animate-bounce cursor-pointer absolute bottom-5"
      onClick={scrollToNext}
    />
  )
}

export default NextSectionButton