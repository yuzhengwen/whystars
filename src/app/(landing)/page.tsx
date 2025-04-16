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
      <div className="landing text-center text-gray-200 relative bg-gray-900">
        <nav className="flex flex-row items-center justify-between w-full h-16 px-4 sticky top-0">
          <Link href="/">
            WhyStars
          </Link>
          <div className="flex flex-row gap-8">
            <Link href="/about" className="text-xl">
              About
            </Link>
            <Link href="/mods" className="text-xl">
              Mods
            </Link>
            <Link href="/plan" className="text-xl">
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
              className="landing-button w-40 h-15 text-xl bg-rose-900 cursor-pointer"
            >
              Get Started
            </button>
          </Link>
          <NextSectionButton className="mt-8" />
        </section>
        <section className="w-full h-fit flex flex-col items-center justify-center gap-2 pt-24">
          <Providers>
            <ModeToggleIconOnly />
            <div className="max-w-7xl w-full h-fit border-2 border-gray-700">
              <TimetableDiv
                mods={mods}
                modIndexesBasic={modIndexesBasic}
                interactive={false}
                fixedHeight={false}
              />
            </div>
          </Providers>
          <div className="gap-32 flex flex-row justify-center items-center mt-8">
            <span className="text-3xl">Beautiful</span>
            <span className="text-3xl">Smart</span>
            <span className="text-3xl">Yours</span>
          </div>
        </section>
        <section className="w-full h-fit flex flex-col items-center justify-center gap-2 p-24">
          <h2 className="text-5xl">How?</h2>
        </section>
      </div>
    </>
  );
}
