import React, { useEffect } from "react";
import MultipleSelector, { Option } from "./MultipleSelector";
import { MinimalMod } from "@/types/modtypes";

interface SelectModsProps {
  onChange?: (selectedValues: string[]) => void;
}
// https://shadcnui-expansions.typeart.cc/docs/multiple-selector
const SelectMods: React.FC<SelectModsProps> = ({ onChange }) => {
  const [options, setOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:3000/data/module_list.json");
      const data: MinimalMod[] = await res.json();
      setOptions(
        data.map((course: MinimalMod) => ({
          value: course.course_code,
          label: `${course.course_code} - ${course.course_name}`,
        }))
      );
      console.log("Fetched mods:", data);
    };
    fetchData();
  }, []);
  
  const handleSelectionChange = (options: Option[]) => {
    const values = options.map((option: Option) => option.value);
    onChange?.(values);
  };

  return (
    <div className="w-full px-10">
      <MultipleSelector
        options={options}
        placeholder="Select mods"
        onChange={handleSelectionChange}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default SelectMods;
