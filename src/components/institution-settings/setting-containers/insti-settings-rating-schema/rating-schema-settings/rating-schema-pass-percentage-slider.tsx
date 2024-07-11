import type { RatingSchema } from "@prisma/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateRatingSchema } from "@/src/client-functions/client-rating-schema";
import { useDebounce } from "@/src/client-functions/client-utils/hooks";
import Box from "@/src/components/reusable/box";
import { Slider } from "@/src/components/reusable/shadcn-ui/slider";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import useRatingSchemaTable from "../zustand";
import useRatingSchemaSettings from "./zustand";

export default function RatingSchemaPassPercentageSlider({
  schema,
}: {
  schema: RatingSchema;
}) {
  const { t } = useTranslation("page");
  const { schemas, setSchemas } = useRatingSchemaTable();
  const [percentage, setPercentage] = useState<number>(schema.passPercentage);
  const { setSchema } = useRatingSchemaSettings();

  useDebounce(
    async () => {
      const updatedSchema = await updateRatingSchema({
        id: schema.id,
        name: schema.name,
        passPercentage: percentage,
        default: schema.default,
      });

      if (updatedSchema) {
        setSchemas(
          schemas.map((s) => {
            if (s.id === schema.id) return updatedSchema;
            else return s;
          }),
        );
        setSchema(updatedSchema);
      }
    },
    [percentage],
    500,
  );

  return (
    <Box>
      <div className="flex h-10 items-center gap-2">
        <Slider
          min={1}
          max={100}
          step={1}
          onValueChange={(value) => setPercentage(value[0] as number)}
          defaultValue={[percentage]}
        />
        <span>{percentage}%</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-contrast">
          {t("rating_schema.pass.percentage")}
        </p>
        <WithToolTip text="rating_schema.pass.description" />
      </div>{" "}
    </Box>
  );
}
