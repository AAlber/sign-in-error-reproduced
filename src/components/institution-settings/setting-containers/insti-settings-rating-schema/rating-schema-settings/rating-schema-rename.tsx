import type { RatingSchema } from "@prisma/client";
import { Edit } from "lucide-react";
import { updateRatingSchema } from "@/src/client-functions/client-rating-schema";
import { PopoverStringInput } from "@/src/components/reusable/popover-string-input";
import useRatingSchemaTable from "../zustand";
import useRatingSchemaSettings from "./zustand";

export default function RatingSchemaRename({
  schema,
}: {
  schema: RatingSchema;
}) {
  const { schemas, setSchemas } = useRatingSchemaTable();
  const { setSchema } = useRatingSchemaSettings();
  return (
    <PopoverStringInput
      actionName="general.rename"
      onSubmit={async (name) => {
        if (!schema) return;
        const updatedSchema = await updateRatingSchema({
          id: schema.id,
          name: name,
          passPercentage: schema.passPercentage,
          default: schema.default,
        });
        if (updatedSchema) {
          setSchemas(
            schemas.map((s) => (s.id === schema.id ? updatedSchema : s)),
          );
          setSchema(updatedSchema);
        }
      }}
    >
      <Edit className="h-4 w-4" />
    </PopoverStringInput>
  );
}
