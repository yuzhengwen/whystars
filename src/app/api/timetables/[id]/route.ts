import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // only authenticated users can access this route
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const timetable = await prisma.timetable.findFirst({
    where: { userId: session.user.id, id: parseInt(id) },
    select: {
      name: true,
      modindexes: true,
    },
  });
  return NextResponse.json(timetable);
}
