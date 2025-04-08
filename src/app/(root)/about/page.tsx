export default async function Home() {
  return (
    <div className="flex flex-col items-start justify-center w-5/6 md:w-2xl p-4 m-5">
      <h1 className="text-3xl">
        What can <span className="font-bold">Why Stars</span> do?
      </h1>
      <ul className="mt-4 text-lg list-disc list-inside">
        <li>Search for modules and their respective index</li>
        <li>Easy visual layout and configuring of timetable</li>
        <li>Generate valid timetables based on the selected modules</li>
        <li>Save the generated timetable</li>
        <li>Access your timetable anywhere by creating an account</li>
      </ul>
      <h2 className="mt-4 text-2xl">Upcoming Features</h2>
      <ul className="mt-4 text-lg list-disc list-inside">
        <li>AI Integration</li>
        <li>Save & load multiple timetables</li>
        <li>Much more...</li>
      </ul>
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
        free to fork the repo and create a pull request. I would love to see
        your contributions! If you have any suggestions or feedback, please feel
        free to create an issue on GitHub.
      </p>
      <h2 className="mt-4 text-2xl">Stack</h2>
      <ul className="mt-4 text-m list-disc list-inside">
        <li>Framework: Next.js 15</li>
        <li>Styling: Tailwind CSS & Shadcn</li>
        <li>Database: Neon, Prisma ORM</li>
        <li>Auth: Auth.js</li>
        <li>Deployment: Vercel</li>
      </ul>
    </div>
  );
}
