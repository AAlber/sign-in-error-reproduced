import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { syncMoodleDataPoints } from "@/src/client-functions/client-moodle-integration";
import { MoodleActionsValidator } from "@/src/client-functions/client-moodle-integration/moodle-actions-validator";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { MoodleAccountInformation } from "@/src/server/functions/server-moodle/types";
import type { MoodleIntegrationDataPoint } from "../schema";
import { MOODLE_QUERY_KEY } from "../schema";
import { DataPointItem } from "./data-point-item";

type Props = {
  dataPoints: MoodleIntegrationDataPoint;
  isLoading: boolean;
  capabilities?: MoodleAccountInformation["functions"];
  onValueChange: (value: MoodleIntegrationDataPoint) => void;
};

export default function MoodleDataPoints({
  capabilities,
  dataPoints,
  isLoading,
  onValueChange,
}: Props) {
  const queryClient = useQueryClient();
  const entries = Object.entries(dataPoints ?? {}) as [
    keyof MoodleIntegrationDataPoint,
    MoodleIntegrationDataPoint[keyof MoodleIntegrationDataPoint],
  ][];

  const { mutateAsync } = useMutation({
    mutationFn: syncMoodleDataPoints,
    onSuccess: async () => {
      queryClient.invalidateQueries(MOODLE_QUERY_KEY);
      toast.success("Success", { description: "Moodle sync success" });
    },
  });

  const actionsValidator = new MoodleActionsValidator(
    capabilities?.map(({ name }) => name) ?? [],
  );

  return (
    <SettingsSection
      title="moodle.data_to_transfer"
      subtitle="moodle.data_to_transfer.subtitle"
      loading={isLoading}
      footerButtonText="moodle.settings.sync_data_points"
      footerButtonDisabled={isLoading || !capabilities}
      footerButtonAction={() => mutateAsync(dataPoints).catch(console.log)}
    >
      <ul className="space-y-4 rounded-md border border-border p-2">
        {entries.map(([datapoint, value]) => {
          const allowedActions: ("read" | "write" | "readWrite")[] = [];

          switch (datapoint) {
            case "users": {
              if (actionsValidator.canReadWriteUsers)
                allowedActions.push("readWrite");
              else if (actionsValidator.canReadUsers)
                allowedActions.push("read");
              break;
            }
            case "courses": {
              if (actionsValidator.canReadWriteCourses)
                allowedActions.push("readWrite");
              else if (actionsValidator.canReadCourses)
                allowedActions.push("read");
              break;
            }
            case "appointments": {
              if (actionsValidator.canReadWriteAppointments)
                allowedActions.push("readWrite");
              else if (actionsValidator.canReadAppointments)
                allowedActions.push("read");
              break;
            }
          }

          return (
            <DataPointItem
              key={datapoint}
              label={datapoint}
              value={value}
              capabilities={allowedActions}
              onChange={(k, v) => onValueChange({ ...dataPoints, [k]: v })}
            />
          );
        })}
      </ul>
    </SettingsSection>
  );
}
