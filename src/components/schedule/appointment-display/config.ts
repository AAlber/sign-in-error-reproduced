/** The offset from top of container until 00:00 */
export const REM_FROM_TOP_OF_CONTAINER_TO_MIDNIGHT = 1.75;
export const MIN_GRID_SPAN = 10; //
export const MIN_ROW_HEIGHT = 3;
export const TOTAL_COLUMNS = 7 * MIN_GRID_SPAN; // 70
export const MINUTE_INTERVALS_IN_HOUR = 5;
export const INTERVALS_PER_DAY = (24 * 60) / MINUTE_INTERVALS_IN_HOUR; // 288 Intervals of 5minutes per day
export const CALENDAR_CONTAINER_ID = "appointment-week-display";
export const DRAG_THRESHOLD = 10;

export const APPOINTMENTS_QUERY_KEY = ["appointments-calendar"];

/** @deprecated */
export const DELAY_UNTIL_DRAG_START = 0;
