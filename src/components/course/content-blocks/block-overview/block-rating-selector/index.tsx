import type { ContentBlockRating, RatingSchemaValue } from "@prisma/client";
import cuid from "cuid";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRatingSchemas } from "@/src/client-functions/client-rating-schema";
import { truncate } from "@/src/client-functions/client-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { UpsertUserGrading } from "@/src/types/content-block/types/cb-types";
import type { RatingSchemaWithValues } from "@/src/types/rating-schema.types";
import useContentBlockOverview from "../zustand";
import RatingSchemaSelector from "./rating-schema-selector";
import RatingSelectorValues from "./rating-selector-values";

type Props = {
  userId: string;
  rating?: ContentBlockRating;
  onLoadedGrading: (data: UpsertUserGrading) => void;
};

export default function BlockRatingSelector({
  userId,
  rating,
  onLoadedGrading,
}: Props) {
  const { block } = useContentBlockOverview();
  const { t } = useTranslation("page");
  const [loadingSchemas, setLoadingSchemas] = useState(false);
  const [schemas, setSchemas] = useState<RatingSchemaWithValues[]>([]);
  const [schema, setSchema] = useState<RatingSchemaWithValues | null>(null);
  const [ratingValue, setRatingValue] = useState<RatingSchemaValue | null>(
    null,
  );

  useEffect(() => {
    if (!rating) return;
    setRatingValue({
      id: cuid(),
      ratingSchemaId: cuid(),
      name: rating.ratingLabel,
      min: rating.min,
      max: rating.max,
    });
  }, [rating]);

  useEffect(() => {
    if (!schema) {
      loadSchemas();
      return;
    }

    const data = {
      blockId: rating?.blockId,
      max: rating?.max,
      min: rating?.min,
      ratingLabel: rating?.ratingLabel,
      passed: rating ? rating.min >= schema?.passPercentage : false,
      schemaName: schema.name,
      userId,
    };

    onLoadedGrading(data as UpsertUserGrading);
  }, [schema]);

  if (!block) return null;
  async function handleValueSelection(value: RatingSchemaValue) {
    if (!schema || !block) return;
    setRatingValue(value);

    const data = {
      blockId: block.id,
      max: value.max,
      min: value.min,
      ratingLabel: value.name,
      passed: value.min >= schema.passPercentage,
      schemaName: schema.name,
      userId: userId,
      text: "",
      graderUserId: "",
    };

    onLoadedGrading(data as UpsertUserGrading);
  }

  async function loadSchemas() {
    setLoadingSchemas(true);
    const data = await getRatingSchemas();
    if (!data) return;
    setSchemas(data);
    data.find((s) => {
      if (s.default) setSchema(s);
    });
    setLoadingSchemas(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={!schema} className="w-full">
        <div className="flex w-full items-center justify-start gap-2 text-muted-contrast hover:opacity-60">
          {ratingValue !== null ? (
            <span className="text-sm font-medium text-contrast">
              {truncate(ratingValue.name, 18)}
            </span>
          ) : (
            <span className="text-sm font-normal text-muted-contrast">
              {t("content_rating.not_rated")}
            </span>
          )}
          <ChevronDown className="h-4 w-4 text-contrast" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {loadingSchemas && (
          <DropdownMenuItem className="flex items-center justify-center">
            <span className="font-medium text-muted-contrast">
              {t("general.loading")}
            </span>
          </DropdownMenuItem>
        )}
        {!loadingSchemas && schema && (
          <>
            <RatingSelectorValues
              schema={schema}
              onValueChange={handleValueSelection}
            />
            <RatingSchemaSelector
              schemas={schemas}
              schema={schema}
              setSchema={setSchema}
              setRatingValue={setRatingValue}
            />
          </>
        )}
        {!loadingSchemas && schemas.length === 0 && (
          <DropdownMenuLabel>
            <p className="flex w-64 flex-col gap-1 text-base">
              {t("content_rating.no_schemas")}{" "}
              <span className="text-sm font-normal text-muted-contrast">
                {t("content_rating.no_schemas.desc")}
              </span>
            </p>
          </DropdownMenuLabel>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
