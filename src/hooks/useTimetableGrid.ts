import { IMod } from "@/lib/models/modModel";
import { createModIndexWithString, ModIndexBasic } from "@/types/modtypes";
import { TimetableGrid } from "@/types/TimetableGrid";
import { useMemo } from "react";

export function useTimetableGrid(
  mods: IMod[],
  modIndexesBasic: ModIndexBasic[]
) {
  return useMemo(() => {
    const grid = new TimetableGrid();
    mods.forEach((mod) => {
      const index =
        modIndexesBasic.find((m) => m.courseCode === mod.course_code)?.index ??
        mod.indexes[0].index;
      grid.addIndex(createModIndexWithString(mod, index));
    });

    const isEmpty = grid.isEmpty();
    const earliestStartTime = isEmpty
      ? "No Mods Selected"
      : grid.findEarliestStartTime();
    const latestEndTime = isEmpty
      ? "No Mods Selected"
      : grid.findLatestEndTime();

    return { grid, earliestStartTime, latestEndTime };
  }, [mods, modIndexesBasic]);
}
