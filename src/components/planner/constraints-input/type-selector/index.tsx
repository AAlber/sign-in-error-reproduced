import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoadingSparkles } from "@/src/components/reusable/loading-sparkles";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../reusable/shadcn-ui/select";
import {
  canHaveOfflineAppointments,
  verifyAllLayersHaveRoom,
} from "../../functions";
import usePlanner from "../../zustand";
import { ContraintPreferenceItem } from "../contraint-preference-item";

export default function TypeSelector() {
  const { t } = useTranslation("page");
  const {
    layers,
    aiLoading,
    constraints,
    updateConstraints,
    typeManualSelection,
    setTypeManualSelection,
  } = usePlanner();

  useEffect(() => {
    if (!typeManualSelection) {
      if (verifyAllLayersHaveRoom(layers)) {
        updateConstraints({
          options: {
            ...constraints.options,
            type: "offline",
          },
        });
      } else {
        updateConstraints({
          options: {
            ...constraints.options,
            type: "online",
          },
        });
      }
    }
  }, [layers, typeManualSelection]);

  return (
    <ContraintPreferenceItem
      title="planner_type_title"
      description="planner_type_description"
    >
      <WithToolTip
        disabled={canHaveOfflineAppointments(layers)}
        text="planner.offline-no-rooms-selected"
      >
        <Select
          value={constraints.options.type}
          disabled={!canHaveOfflineAppointments(layers)}
          onValueChange={(value) => {
            setTypeManualSelection(true);
            updateConstraints({
              options: {
                ...constraints.options,
                type: value as "online" | "offline",
              },
            });
          }}
        >
          <SelectTrigger>
            <div className="relative flex w-full items-center justify-end">
              <LoadingSparkles
                loading={aiLoading}
                particleDensity={500}
                id="type"
              >
                <SelectValue />
              </LoadingSparkles>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"online"}>{t("planner_online")}</SelectItem>
            <SelectItem value={"offline"}>{t("planner_offline")}</SelectItem>
          </SelectContent>
        </Select>
      </WithToolTip>
    </ContraintPreferenceItem>
  );
}
