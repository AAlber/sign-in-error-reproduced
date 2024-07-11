import type { RatingSchemaValue } from "@prisma/client";
import classNames from "@/src/client-functions/client-utils";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { RatingSchemaWithValues } from "@/src/types/rating-schema.types";

export default function RatingSelectorValues({
  schema,
  onValueChange,
}: {
  schema: RatingSchemaWithValues;
  onValueChange: (value: RatingSchemaValue) => void;
}) {
  return (
    <>
      {schema.values
        .sort((a, b) => b.min - a.min)
        .map((value) => (
          <DropdownMenuItem
            key={value.id}
            className="flex items-center justify-between"
            onClick={() => onValueChange(value)}
          >
            <span className="font-medium text-contrast">{value.name}</span>{" "}
            <span
              className={classNames(
                "ml-2",
                value.min >= schema.passPercentage
                  ? "text-positive"
                  : "text-destructive",
              )}
            >
              ({value.min}% - {value.max}%)
            </span>
          </DropdownMenuItem>
        ))}
    </>
  );
}
