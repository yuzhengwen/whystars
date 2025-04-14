import { IMod } from "@/lib/models/modModel";
import AddModButton from "@/components/AddModButton";
import { ModBasicInfoSchema } from "@/types/modtypes";

export async function generateStaticParams() {
  const res = await fetch(`${process.env.DATA_BASE_URL}/module_list.json`, {
    cache: "force-cache",
    next: { revalidate: 28800 }, // 8 hours
  });
  const data = await res.json();
  const parsedData = ModBasicInfoSchema.parse(data);
  return parsedData.map((mod) => ({
    slug: mod.course_code,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await fetch(`${process.env.DATA_BASE_URL}/mods/${slug}.json`, {
    cache: "force-cache",
    next: { revalidate: 28800 }, // 8 hours
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data: IMod = await res.json();
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
        <div className="flex flex-row gap-5">
          <p className="text-lg mb-2">Course Code: {data.course_code}</p>
          <p className="text-lg mb-2">AUs: {data.academic_units}</p>
        </div>
        <AddModButton mod={data} />
        <table className="min-w-full border-collapse border border-gray-200 mt-5">
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
