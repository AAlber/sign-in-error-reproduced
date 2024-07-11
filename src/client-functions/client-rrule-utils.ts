import { RRule } from "rrule";

export const freqToString = (freq: number, interval?: number) => {
  switch (freq) {
    case RRule.DAILY:
      return "DAILY";
    case RRule.WEEKLY:
      return interval === 2 ? "WEEKLY_2" : "WEEKLY";
    case RRule.MONTHLY:
      return "MONTHLY";
    case RRule.YEARLY:
      return "YEARLY";
    default:
      return "doesNotRepeat";
  }
};

export const stringToFreq = (str: string) => {
  switch (str) {
    case "DAILY":
      return RRule.DAILY;
    case "WEEKLY":
      return RRule.WEEKLY;
    case "WEEKLY_2":
      return RRule.WEEKLY;
    case "MONTHLY":
      return RRule.MONTHLY;
    case "YEARLY":
      return RRule.YEARLY;
    default:
      return null;
  }
};

export const freqToInterval = (freq) => {
  switch (freq) {
    case RRule.DAILY:
      return "day";
    case RRule.WEEKLY:
      return "week";
    case RRule.MONTHLY:
      return "month";
    case RRule.YEARLY:
      return "year";
    default:
      return "day";
  }
};

export const isDateOlderThanCurrentDate = (date: Date) => {
  const currentDate = new Date();
  const comparedDate = new Date(date);
  currentDate.setHours(0, 0, 0, 0);
  comparedDate.setHours(0, 0, 0, 0);
  return date < currentDate;
};
