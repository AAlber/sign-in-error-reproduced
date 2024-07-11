import type { User } from "@prisma/client";
import type { ECTsDataPoints, EctsExportData } from "@/src/types/ects.types";

export type EctsExportDocumentArgs = {
  data: EctsExportData;
  dataPoints: ECTsDataPoints;
  institutionId: string;
  language?: string;
  user?: OrNull<User>;
};

export type TableHeaders = ECTsDataPoints & {
  hasTimeConstrainingLayer: boolean;
};

export type EctsAggregatedData = {
  [k in keyof TableHeaders]: string;
} & CommonData;

type CommonData = {
  layerId: string;
  name: string;
  totalPoints: number;
};
