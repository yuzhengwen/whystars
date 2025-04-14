import { parseTimeToMinutes } from "./dates";

export class TimeRange {
  startTime: string;
  endTime: string;
  duration: number;
  startMinutes: number;
  endMinutes: number;
  toString(): string {
    return `${this.startMinutes} - ${this.endMinutes}`;
  }
  /**
   * Times given in 24h format, Colon optional
   * @param startTime 
   * @param endTime 
   */
  constructor(startTime: string, endTime: string) {
    startTime = startTime.replace(":", "");
    endTime = endTime.replace(":", "");
    this.startTime = startTime;
    this.endTime = endTime;
    this.startMinutes = parseTimeToMinutes(startTime);
    this.endMinutes = parseTimeToMinutes(endTime);
    this.duration = this.endMinutes - this.startMinutes;
  }
  isOverlap(other: TimeRange): boolean {
    return (
      this.startMinutes < other.endMinutes &&
      this.endMinutes > other.startMinutes
    );
  }
}
