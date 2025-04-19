import Link from "next/link";

export default async function Home() {
  return (
    <div className="flex flex-col items-start justify-center w-5/6 md:w-2xl m-5">
      <h1 className="text-3xl">
        What can <span className="font-bold">Why Stars</span> do?
      </h1>
      <ul className="mt-4 text-lg list-disc list-inside">
        <li>Search for modules and their respective index</li>
        <li>Easy visual layout and configuring of timetable</li>
        <li>
          Generate valid timetables based on the selected modules and your
          specified requirements
        </li>
        <li>Save & load the timetables</li>
        <li>Access your timetable anywhere by creating an account</li>
        <li>Export in various formats</li>
      </ul>
      <h2 className="mt-4 text-2xl">Upcoming Features</h2>
      <ul className="mt-4 text-lg list-disc list-inside">
        <li>Easily share timetable with your friends</li>
        <li>More options to specify for timetable generation</li>
        <li>AI Integration</li>
        <li>Much more...</li>
        <li>You can request them too!</li>
      </ul>
      <h1 className="mt-4 text-3xl">Have Feedback/Suggestions?</h1>
      <p className="mt-2 text-lg">
        <Link href="/contact" className="text-blue-600">
          Contact me here
        </Link>
      </p>
      <h1 className="mt-4 text-3xl">Source Code</h1>
      <p className="text-blue-700 mt-4 text-lg hover:text-blue-600 hover:underline cursor-pointer">
        <a
          href="https://github.com/yuzhengwen/whystars"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repo
        </a>
      </p>
      <p className="mt-2 text-m">
        This is a one developer project, if you would like to contribute, feel
        free to visit the source repository and follow the README. I would love to see
        your contributions! 
      </p>
      <h2 className="mt-4 text-2xl">Stack</h2>
      <ul className="mt-4 text-m list-disc list-inside">
        <li>Framework: Next.js 15</li>
        <li>Styling & UI: Tailwind CSS, Shadcn, Framer Motion</li>
        <li>Database: Neon, Prisma ORM</li>
        <li>Auth: Auth.js</li>
        <li>Deployment: Vercel</li>
        <li>Other Notable Libraries: Zustand, zod, html2canvas-pro, jspdf</li>
      </ul>
    </div>
  );
}
