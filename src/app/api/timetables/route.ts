import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "../../../../auth";

export async function GET() {
  // only authenticated users can access this route
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const timetables = await prisma.timetable.findMany({
    where: { userId: session?.user?.id },
  });
  return NextResponse.json(timetables);
}
