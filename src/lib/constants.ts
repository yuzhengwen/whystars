export const navItems: Map<string, string> = new Map([
  ["Home", "/"],
  ["About", "/about"],
  ["Mods", "/mods"],
  ["Plan", "/plan"],
]);
export const days: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const times: string[] = generateTimeSlots("0830", "2230", "30"); // 30 min slots

function generateTimeSlots(
  start: string,
  end: string,
  interval: string
): string[] {
  const startTime = parseInt(start);
  const endTime = parseInt(end);
  const intervalMinutes = parseInt(interval);
  const slots = [];
  let currentMinutes = Math.floor(startTime / 100) * 60 + (startTime % 100);
  const endMinutes = Math.floor(endTime / 100) * 60 + (endTime % 100);

  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const formattedTime = `${hours.toString().padStart(2, "0")}${minutes
      .toString()
      .padStart(2, "0")}`;
    slots.push(formattedTime);
    currentMinutes += intervalMinutes;
  }
  // convert to number , then sort
  slots.sort((a, b) => parseInt(a) - parseInt(b));
  return slots;
}
