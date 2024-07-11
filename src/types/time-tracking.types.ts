export type TimeTrackingData = {
  appointments: TimeTrackingItem[];
  timeAsParticipant: number;
  timeAsOrganizer: number;
};

type TimeTrackingItem = {
  layerPath: string;
  title: string;
  organizer: boolean;
  duration: number;
  dateTime: Date;
};

export enum TimeTrackingExportType {
  LAST_DAY,
  LAST_WEEK,
  LAST_MONTH,
  LAST_YEAR,
  ALL_TIME,
}
