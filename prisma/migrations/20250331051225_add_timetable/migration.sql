-- CreateTable
CREATE TABLE "timetable" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Default Timetable',
    "modindexes" JSONB NOT NULL DEFAULT '[]',
    "userId" TEXT NOT NULL,

    CONSTRAINT "timetable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
