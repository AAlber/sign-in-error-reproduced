import type { RatingSchema } from "@prisma/client";
import { Cog, Flag, MoreHorizontal, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  deleteRatingSchema,
  updateRatingSchema,
} from "@/src/client-functions/client-rating-schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { toast } from "@/src/components/reusable/toaster/toast";
import useRatingSchemaSettings from "./rating-schema-settings/zustand";
import useRatingSchemaTable from "./zustand";

export default function RatingSchemaMenu({ schema }: { schema: RatingSchema }) {
  const { schemas, setSchemas } = useRatingSchemaTable();
  const { init } = useRatingSchemaSettings();
  const { t } = useTranslation("page");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <MoreHorizontal className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => init(schema)}>
          <Cog aria-hidden="true" className="h-4 w-4" />
          <span>{t("settings")}</span>
        </DropdownMenuItem>
        {!schema.default && (
          <DropdownMenuItem
            onClick={async () => {
              setSchemas(
                schemas.map((s) => {
                  if (s.id === schema.id) return { ...s, default: true };
                  else return { ...s, default: false };
                }),
              );
              const updatedSchema = await updateRatingSchema({
                id: schema.id,
                name: schema.name,
                passPercentage: schema.passPercentage,
                default: true,
              });

              if (!updatedSchema) return setSchemas(schemas);
            }}
          >
            <Flag aria-hidden="true" className="h-4 w-4" />
            <span>{t("rating_schema.make.default")}</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={async () => {
            if (schema.default) {
              return toast.warning("rating_schema.error.delete", {
                description: "rating_schema.error.delete.desc",
              });
            }
            setSchemas(schemas.filter((s) => s.id !== schema.id));
            const deletedSchema = await deleteRatingSchema({ id: schema.id });
            if (!deletedSchema) return setSchemas(schemas);
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
