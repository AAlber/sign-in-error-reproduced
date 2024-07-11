import type { RatingSchemaValue } from "@prisma/client";
import { MoreHorizontal, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { deleteRatingSchemaValue } from "@/src/client-functions/client-rating-schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useRatingSchemaSettings from "./zustand";

export default function RatingSchemaValueMenu({
  value,
}: {
  value: RatingSchemaValue;
}) {
  const { values, setValues } = useRatingSchemaSettings();
  const { t } = useTranslation("page");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={async () => {
            setValues(values.filter((s) => s.id !== value.id));
            const deletedValue = await deleteRatingSchemaValue({
              id: value.id,
            });
            if (!deletedValue) return setValues(values);
          }}
        >
          <p className="flex w-full items-center gap-2 text-destructive">
            <Trash aria-hidden="true" className="h-4 w-4" />
            <span>{t("general.delete")}</span>
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
