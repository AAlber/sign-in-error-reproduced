import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createRatingSchema } from "@/src/client-functions/client-rating-schema";
import { PopoverStringInput } from "@/src/components/reusable/popover-string-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useRatingSchemaSettings from "./rating-schema-settings/zustand";
import useRatingSchemaTable from "./zustand";

export default function RatingSchemaCreateButton() {
  const { schemas, setSchemas } = useRatingSchemaTable();
  const { init } = useRatingSchemaSettings();
  const { t } = useTranslation("page");
  return (
    <PopoverStringInput
      actionName="general.create"
      onSubmit={async (name) => {
        const schema = await createRatingSchema({ name: name });
        if (schema) {
          setSchemas([...schemas, schema]);
          init(schema);
        }
      }}
    >
      <Button>
        {<Plus className="mr-1 h-4 w-4" />} {t("general.create")}
      </Button>
    </PopoverStringInput>
  );
}
