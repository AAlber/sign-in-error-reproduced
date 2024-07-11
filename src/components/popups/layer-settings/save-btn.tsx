import dayjs from "dayjs";
import * as React from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { toast } from "@/src/components/reusable/toaster/toast";
import useUser from "@/src/zustand/user";
import { Button } from "../../reusable/shadcn-ui/button";
import useLayerSettings from "./zustand";

export default function LayerSaveButton() {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { reset, layer, subtitle, endTime, startTime, title, displayName } =
    useLayerSettings();
  const { t } = useTranslation("page");
  const [loading, setLoading] = React.useState(false);

  const hasDateChanges =
    startTime?.toString() !== layer?.start?.toString() ||
    endTime?.toString() !== layer?.end?.toString();

  const hasNameChanges =
    title !== layer?.name ||
    (!!displayName && displayName !== layer?.displayName);

  const hasAnyChanges = hasDateChanges || hasNameChanges;

  async function save() {
    if (!layer || !hasAnyChanges) return;
    if (startTime && endTime) {
      if (dayjs(startTime).isAfter(endTime)) {
        toast.warning("toast.layer_settings_warning_time_span", {
          description: "toast.layer_settings_warning_time_span_description",
        });
        return;
      }
    }

    setLoading(true);

    const promises: Promise<void>[] = [];

    if (hasDateChanges) {
      promises.push(
        structureHandler.update.layerTimeSpan({
          layer: layer as any,
          startTime,
          endTime,
        }),
      );
    }

    if (hasNameChanges) {
      promises.push(
        structureHandler.update.layerName(
          title,
          displayName,
          subtitle,
          layer as any,
        ),
      );
    }

    await Promise.all(promises);
    setLoading(false);
    reset();
  }

  return (
    <Button variant={"cta"} onClick={save} disabled={!hasAnyChanges || loading}>
      {t(loading ? "general.loading" : "general.save")}
    </Button>
  );
}
