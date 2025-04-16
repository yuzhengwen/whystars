import { Highlight } from "@/components/ui/hero-highlight";
import "./styles.css";
import Link from "next/link";
import TimetableDiv from "@/components/TimetableDiv";
import { ModIndexBasic } from "@/types/modtypes";
import { promises as fs } from "fs";
import { IMod } from "@/lib/models/modModel";

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
        <div className="max-w-7xl w-full h-fit border-2 border-gray-700">
          <TimetableDiv
            mods={mods}
            modIndexesBasic={modIndexesBasic}
            interactive={false}
            fixedHeight={false}
          />
        </div>
      </section>
      <section className="w-full h-dvh flex flex-col items-center justify-center snap-center relative">
        <div className="gap-16 flex flex-row justify-center items-center mt-10">
          <span className="text-2xl">Beautiful</span>
          <span className="text-2xl">Smart</span>
          <span className="text-2xl">Yours</span>
        </div>
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
