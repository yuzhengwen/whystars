import { Highlight } from "@/components/ui/hero-highlight";
import "./styles.css";
import Link from "next/link";
import TimetableDiv from "@/components/TimetableDiv";
import { ModIndexBasic } from "@/types/modtypes";
import { promises as fs } from "fs";
import { IMod } from "@/lib/models/modModel";
import NextSectionButton from "./NextSectionButton";
import Providers from "@/components/Providers";
import { ModeToggleIconOnly } from "@/components/ModeToggleIconOnly";
import { ColourfulText } from "@/components/ui/colourful-text";
import { CardDemo } from "./landing-card";
import MobileNav from "@/components/MobileNav";

const modColors: Record<string, string> = {
  SC2002: "#3F37C9",
  SC2005: "#1b998b",
};
export default async function Home() {
  const file = await fs.readFile("./public/data/landingexample.json", "utf-8");
  const mods: IMod[] = JSON.parse(file);
  const modIndexesBasic: ModIndexBasic[] = mods.map((mod) => {
    return {
      courseName: mod.course_name,
      courseCode: mod.course_code,
      index: mod.indexes[0].index,
    };
  });
  return (
    // <div className="landing snap-y snap-mandatory overflow-y-scroll h-screen w-screen text-center text-gray-200 relative bg-gray-900">
    <>
      <div className="landing text-center text-gray-800 dark:text-gray-200 relative">
        <nav className="flex flex-row items-center justify-between w-full h-16 px-4 sticky top-0">
          <span className="text-2xl">WhyStars</span>
          <MobileNav />
          <div className="flex-row gap-8 hidden md:flex">
            <Link
              href="/about"
              className="text-xl after:bg-gray-800 dark:after:bg-gray-200"
            >
              About
            </Link>
            <Link
              href="/mods"
              className="text-xl after:bg-gray-800 dark:after:bg-gray-200"
            >
              Mods
            </Link>
            <Link
              href="/plan"
              className="text-xl after:bg-gray-800 dark:after:bg-gray-200"
            >
              Plan
            </Link>
          </div>
        </nav>
        <section className="w-full h-fit flex flex-col items-center justify-center gap-2 pt-24">
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
              className="landing-button w-40 h-15 text-xl bg-rose-900 cursor-pointer text-gray-100 dark:text-gray-200"
            >
              Get Started
            </button>
          </Link>
          <NextSectionButton className="mt-8" />
        </section>
        <section className="w-full h-fit flex flex-col items-center justify-center gap-2 pt-24">
          <Providers>
            <div className="max-w-7xl w-full h-fit">
              <div className="gap-32 flex flex-row justify-center items-center mt-2 relative">
                <span className="text-4xl font-bold mb-2">
                  Beautiful, Smart, <ColourfulText text="Yours" />
                  <ModeToggleIconOnly className="absolute right-0" />
                </span>
              </div>
              <TimetableDiv
                mods={mods}
                modIndexesBasic={modIndexesBasic}
                interactive={false}
                fixedHeight={false}
                modColors={modColors}
              />
            </div>
          </Providers>
        </section>
        <section className="w-full h-fit flex flex-col items-center justify-center gap-2 pt-24 pb-24">
          <h2 className="text-4xl">What can we do?</h2>
          <div className="max-w-7/8 lg:max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8">
            <CardDemo
              className="bg-[url('/mods.gif')]"
              title="Search Mods"
              text="Search quickly. Find out details. Add mods you want."
            />
            <CardDemo
              className="bg-[url('/smart-generate.gif')] "
              title="Smart Generate"
              text="Never plan manually again. We generate based on your requirements"
            />
            <CardDemo
              className="bg-[url('/timetables.gif')]"
              title="Create Your Own Timetables"
              text="Save for later. Share with friends. Access anytime, anywhere."
            />
          </div>
        </section>
      </div>
    </>
  );
}
