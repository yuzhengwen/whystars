import { days } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useConstraintsStore } from "@/stores/useConstraintsStore";

const DayConfigInput = ({ index }: { index: number }) => {
  const { dayConfigs, setDayConfigAtIndex } = useConstraintsStore();
  return (
    <div className="flex flex-row gap-1">
      <Select
        onValueChange={(value) => {
          setDayConfigAtIndex(index, {
            ...dayConfigs[index],
            day: value,
          });
        }}
        required
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input
        required
        disabled={dayConfigs[index].avoidDay}
        type="time"
        value={dayConfigs[index].startTime}
        onChange={(e) => {
          setDayConfigAtIndex(index, {
            ...dayConfigs[index],
            startTime: e.target.value,
          });
        }}
      />
      <input
        required
        disabled={dayConfigs[index].avoidDay}
        type="time"
        value={dayConfigs[index].endTime}
        onChange={(e) => {
          setDayConfigAtIndex(index, {
            ...dayConfigs[index],
            endTime: e.target.value,
          });
        }}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={dayConfigs[index].avoidDay}
          onChange={(e) => {
            setDayConfigAtIndex(index, {
              ...dayConfigs[index],
              avoidDay: e.target.checked,
            });
          }}
        />
        Avoid Day
      </label>
    </div>
  );
};

export default DayConfigInput;
