import { useState } from "react";

export function useCycle<T>(values:T[], initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);

  const next = () => {
    setIndex((prevIndex) => (prevIndex + 1) % values.length);
  };

  const prev = () => {
    setIndex((prevIndex) => (prevIndex - 1 + values.length) % values.length);
  };

  const reset = () => {
    setIndex(initialIndex);
  };

  return { value: values[index], next, prev, reset };
}