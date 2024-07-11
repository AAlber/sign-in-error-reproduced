type TotalTimeShorterThanHoursError = {
  severity: "error";
  cause: "total-available-time-shorter-than-hours";
  data: {
    hoursDefinedByConstraints: number;
    totalAvailableTime: number;
  };
};

type HoursLeftOverError = {
  severity: "warning";
  cause: "hours-left-over";
  data: {
    hoursLeftOver: number;
  };
};

type AppointmentsLeftOverError = {
  severity: "warning";
  cause: "appointments-left-over";
  data: {
    appointmentsLeftOver: number;
  };
};

type UnknownError = {
  severity: "error";
  cause: "unknown-error";
  data: {
    message: string;
  };
};

type NoWeekdaysSelectedError = {
  severity: "warning";
  cause: "no-weekdays-selected";
  data: {
    message: string;
  };
};

export type PlannerErrorCause =
  | AppointmentsLeftOverError["cause"]
  | HoursLeftOverError["cause"]
  | TotalTimeShorterThanHoursError["cause"]
  | UnknownError["cause"]
  | NoWeekdaysSelectedError["cause"];

export type PlannerError =
  | AppointmentsLeftOverError
  | TotalTimeShorterThanHoursError
  | HoursLeftOverError
  | UnknownError
  | NoWeekdaysSelectedError;

export type PlannerFunctionResponse<T> =
  | {
      ok: true;
      data: T;
      error?: PlannerError;
    }
  | {
      ok: false;
      error: PlannerError;
      data?: never;
    };
