"use client";
import { Highlight } from "@/components/ui/hero-highlight";
import "./styles.css";
import { MoveDown } from "lucide-react";
import Link from "next/link";
import { useCallback } from "react";

export default function Home() {
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
    <div className="landing snap-y snap-mandatory overflow-y-scroll h-screen w-screen text-center text-gray-200 relative bg-gray-900">
      <section className="w-full h-dvh flex flex-col items-center justify-center snap-center gap-2">
        <h1 className="text-5xl mb-5">Why Stars</h1>
        <Highlight>
          <h2 className="text-2xl p-2">Make your timetable yours</h2>
        </Highlight>
        <p className="mt-4 text-lg text-gray-400">
          Efficiently manage, plan, and organize your timetables with ease.
          <br />
          Never plan manually again. We do it for you.
        </p>
        <Link href="/plan" className="mt-4">
          <button
            type="button"
            className="landing-button w-40 h-15 text-xl bg-rose-900 cursor-pointer"
          >
            Get Started
          </button>
        </Link>
        <div className="gap-16 flex flex-row justify-center items-center mt-10">
          <span className="text-2xl">Beautiful</span>
          <span className="text-2xl">Smart</span>
          <span className="text-2xl">Yours</span>
        </div>
        <MoveDown
          size={36}
          className="animate-bounce cursor-pointer absolute bottom-5"
          onClick={scrollToNext}
        />
      </section>
      <section className="w-full h-dvh flex flex-col items-center justify-center snap-center relative">
        <h2 className="text-5xl">How?</h2>
        <p className="mt-4 text-lg">
          You&apos;ve worked hard for your admission. You&apos;re excited to
          learn. So don&apos;t let your timetable hold you back!
        </p>
      </section>
      <section className="w-full h-dvh flex flex-col items-center justify-center snap-center relative"></section>
    </div>
  );
}
