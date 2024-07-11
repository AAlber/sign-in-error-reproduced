import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createRatingSchemaValue } from "@/src/client-functions/client-rating-schema";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import useRatingSchemaSettings from "./zustand";
import type { RatingSchemaValue } from ".prisma/client";

export default function RatingSchemaAddValueButton() {
  const { values, setValues, schema } = useRatingSchemaSettings();
  const { t } = useTranslation("page");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [min, setMin] = useState<number | undefined>(undefined);
  const [max, setMax] = useState<number | undefined>(undefined);

  const [error, setError] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  if (!schema) return null;

  async function handleSubmit() {
    if (!schema || !label || min === undefined || max === undefined) return;
    if (min > max) return setError(t("rating_schema.range.error1"));
    if (min < 0 || max > 100) return setError(t("rating_schema.range.error2"));
    if (!label) return setError(t("rating_schema.range.error3"));
    if (values.find((v) => v.name === label))
      return setError(t("rating_schema.range.error4"));
    if (label.length > 25) return setError(t("rating_schema.range.error5"));
    if (min === max) return setError(t("rating_schema.range.error6"));

    for (const r of values) {
      if (
        (min >= r.min && min <= r.max) ||
        (max >= r.min && max <= r.max) ||
        (r.min >= min && r.min <= max) ||
        (r.max >= min && r.max <= max)
      ) {
        return setError(t("rating_schema.range.overlap") + r.name);
      }
    }
    const value = await createRatingSchemaValue({
      name: label,
      min: min,
      max: max,
      ratingSchemaId: schema.id,
    });

    setLabel("");
    setMin(undefined);
    setMax(undefined);

    if (!value) return;

    const newValues: RatingSchemaValue[] = [...values, value];

    newValues.sort((a, b) => b.min - a.min);
    setValues(newValues);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(true)}>
        <div className="flex items-center gap-1 text-primary hover:opacity-60">
          {t("add")}
          <Plus className="h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent side="right" className="ml-3 mt-7 w-80">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await handleSubmit();
            setLoading(false);
          }}
          className="grid gap-4"
        >
          <div className="space-y-1">
            <h4 className="font-medium leading-none">
              {t("rating_schema.range")}
            </h4>
            <p className="text-sm text-muted-contrast">
              {t("rating_schema.range.description")}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="label">{t("label")}</Label>
              <Input
                id="label"
                className="col-span-2 h-8"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="min percentage">
                {t("rating_schema.range.min")}
              </Label>
              <div className="relative col-span-2 overflow-hidden rounded-md">
                <span className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-md border-[0.5px] border-border bg-foreground text-sm text-muted-contrast">
                  %
                </span>

                <Input
                  type="number"
                  id="minPercentage"
                  className="col-span-2 h-8"
                  value={min}
                  onChange={(e) => setMin(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="max percentage">
                {t("rating_schema.range.max")}
              </Label>
              <div className="relative col-span-2 overflow-hidden rounded-md">
                <span className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-r-md border-[0.5px] border-border bg-foreground text-sm text-muted-contrast">
                  %
                </span>
                <Input
                  type="number"
                  id="maxPercentage"
                  className=" h-8"
                  value={max}
                  onChange={(e) => setMax(parseFloat(e.target.value))}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-destructive">{t(error)}</p>
              <Button
                disabled={
                  loading || !label || min === undefined || max === undefined
                }
                type="submit"
              >
                {loading ? t("general.loading") : t("general.create")}
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>{" "}
    </Popover>
  );
}
