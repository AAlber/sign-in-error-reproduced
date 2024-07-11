import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  getMoodleAccountInformation,
  getMoodleIntegrationData,
} from "@/src/client-functions/client-moodle-integration";
import Skeleton from "@/src/components/skeleton";
import MoodleAccountInformation from "./account-information";
import MoodleCredentialSettings from "./credentials";
import MoodleDataPoints from "./data-points";
import type { MoodleIntegrationDataPoint } from "./schema";
import { MOODLE_QUERY_KEY } from "./schema";

export default function MoodleSettings() {
  const [dataPoints, setDataPoints] = useState<MoodleIntegrationDataPoint>({
    appointments: "no-transfer",
    courses: "no-transfer",
    users: "no-transfer",
  });

  const moodleIntegrationData = useQuery({
    queryFn: getMoodleIntegrationData,
    queryKey: MOODLE_QUERY_KEY,
    onSuccess: (data) => {
      if (data && data.data) {
        setDataPoints((prev) => ({ ...prev, ...data.data }));
      }
    },
  });

  const moodleAccountInfo = useQuery({
    queryFn: getMoodleAccountInformation,
    enabled: !!moodleIntegrationData.data?.apiKey,
  });

  const handleSyncDataPoints = (value: MoodleIntegrationDataPoint) => {
    setDataPoints((prev) => ({ ...prev, ...value }));
  };

  if (moodleIntegrationData.isLoading) return <Skeleton />;
  return (
    <>
      <MoodleCredentialSettings credentials={moodleIntegrationData.data} />
      {moodleIntegrationData.data?.apiKey &&
        !moodleAccountInfo.isLoading &&
        !moodleAccountInfo.isError && (
          <>
            {moodleAccountInfo.data &&
              !moodleAccountInfo.isFetching &&
              !moodleAccountInfo.data.exception && (
                <MoodleAccountInformation {...moodleAccountInfo.data} />
              )}
            <MoodleDataPoints
              capabilities={moodleAccountInfo.data?.functions}
              dataPoints={dataPoints}
              isLoading={moodleAccountInfo.isLoading}
              onValueChange={handleSyncDataPoints}
            />
          </>
        )}
    </>
  );
}
