import path from "path";
import fs from "fs";
import { IMod } from "@/lib/models/modModel";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let data: IMod = {} as IMod;
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "mods",
      `${slug}.json`
    );
    const fileContents = fs.readFileSync(filePath, "utf-8");
    data = JSON.parse(fileContents);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-4">Module not found</h1>
        <p className="text-lg mb-2">The requested module does not exist.</p>
        <p className="text-lg mb-2">Please check the URL or try again later.</p>
      </div>
    );
  } else {
    return (
        <div className="flex flex-col items-start justify-center w-5/6 md:w-2xl p-4 m-5">
          <h1 className="text-3xl font-bold mb-4">{data.course_name}</h1>
          <p className="text-lg mb-2">{data.course_code}</p>
          <p className="text-lg mb-2">Credits: {data.academic_units}</p>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 px-4 py-2">Index</th>
                <th className="border border-gray-200 px-4 py-2">Lessons</th>
              </tr>
            </thead>
            <tbody>
              {data.indexes.map((index) => (
                <tr key={index.index}>
                  <td className="border border-gray-200 px-4 py-2">
                    {index.index}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {index.lessons.map((lesson, idx) => (
                      <div key={idx}>
                        {lesson.lesson_type} - {lesson.group} - {lesson.day} -{" "}
                        {lesson.time} - {lesson.venue}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="border border-gray-200 px-4 py-2">
                  Total Indexes: {data.indexes.length}
                </td>
              </tr>
            </tfoot>
          </table>
      </div>
    );
  }
}
