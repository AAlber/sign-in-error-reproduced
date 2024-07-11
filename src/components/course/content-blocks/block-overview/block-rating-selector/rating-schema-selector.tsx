import type { RatingSchemaValue } from "@prisma/client";
import { useTranslation } from "react-i18next";
import classNames, { truncate } from "@/src/client-functions/client-utils";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { RatingSchemaWithValues } from "@/src/types/rating-schema.types";

export default function RatingSchemaSelector({
  schemas,
  schema,
  setSchema,
  setRatingValue,
}: {
  schemas: RatingSchemaWithValues[];
  schema: RatingSchemaWithValues;
  setSchema: (schema: RatingSchemaWithValues) => void;
  setRatingValue: (value: RatingSchemaValue | null) => void;
}) {
  const { t } = useTranslation("page");

  if (schemas.length < 2) return null;

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <p className="flex items-center gap-1">
            <span className="text-muted-contrast">
              {t("content_rating.schema")}:
            </span>
            {truncate(schema.name, 20)}
          </p>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {schemas.map((s) => (
            <DropdownMenuItem
              key={s.id}
              className="flex items-center justify-between"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setSchema(s);
              }}
            >
              <p className="flex items-center gap-2">
                <span
                  className={classNames(
                    s.id === schema.id
                      ? "font-medium text-contrast"
                      : "text-muted-contrast",
                  )}
                >
                  {s.name}
                </span>{" "}
              </p>
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </>
  );
}
