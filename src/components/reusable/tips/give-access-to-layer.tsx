import { ArrowRight, CornerDownRight, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { truncate } from "@/src/client-functions/client-utils";
import Box from "../box";
import { Label } from "../shadcn-ui/label";
import Tip from "./tip";

export default function GiveAccessToLayersTip({
  layerName,
}: {
  layerName?: string;
}) {
  const { t } = useTranslation("page");

  return (
    <Tip
      description="giving_access_to_layers_description"
      title={t("give_access_to")}
    >
      <Label
        htmlFor="example-layer"
        className="-mb-1 text-sm font-normal text-contrast"
      >
        {t("example")}
      </Label>
      <Box noPadding className="flex w-full items-center justify-center">
        <div className="my-2 flex flex-col gap-0.5 text-xs">
          <div className="flex items-center gap-1">
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
            {truncate(layerName ?? t("example"), 20)}
          </div>
          <div className="ml-3 flex items-center gap-1 text-muted-contrast">
            <CornerDownRight size={15} className="mb-1" />
            <Plus className="h-3 w-3 text-positive" />
            {t("example_layer_a")}
          </div>
          <div className="ml-9 flex items-center gap-1 text-muted-contrast">
            <CornerDownRight size={15} className="mb-1" />
            <Plus className="h-3 w-3 text-positive" />
            {t("example_course_1")}
          </div>
          <div className="ml-9 flex items-center gap-1 text-muted-contrast">
            <CornerDownRight size={15} className="mb-1" />
            <Plus className="h-3 w-3 text-positive" />
            {t("example_course_2")}
          </div>
        </div>
      </Box>
    </Tip>
  );
}
