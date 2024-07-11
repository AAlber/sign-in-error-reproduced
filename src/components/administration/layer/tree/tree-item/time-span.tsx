import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import classNames from "@/src/client-functions/client-utils";
import type { Layer } from "@/src/components/administration/types";
import useUser from "@/src/zustand/user";
import useAdministration from "../../../zustand";

interface Props {
  layer: Layer;
}

const TimeSpan: React.FC<Props> = (props) => {
  const { user } = useUser();
  dayjs.locale(user.language);
  const { t } = useTranslation("page");
  const { layer } = props;
  const { layerTree_ } = useAdministration();

  const parent = structureHandler.utils.layerTree
    .flattenTree(layerTree_ || [])
    .find((i) => i.id === layer.parent_id);

  const hasParentTimeSpan = parent && (!!parent?.start || !!parent?.end);

  if (!layer.start && !layer.end) return null;

  const startDate = dayjs(layer.start);
  const endDate = dayjs(layer.end);
  const isValidDate = dayjs(startDate).isValid() || dayjs(endDate).isValid();

  if (!isValidDate) return null;

  return (
    <span
      className={classNames(
        "ml-2 text-xs",
        hasParentTimeSpan ? "text-muted" : "text-primary",
      )}
    >
      {" "}
      {layer.start && t("admin_dashboard.layer_time_span_text1")}{" "}
      {layer.start && startDate.format("DD.MM.YY")}{" "}
      {layer.end && t("admin_dashboard.layer_time_span_text2")}{" "}
      {layer.end && endDate.format("DD.MM.YY")}
    </span>
  );
};

export default React.memo(TimeSpan);
