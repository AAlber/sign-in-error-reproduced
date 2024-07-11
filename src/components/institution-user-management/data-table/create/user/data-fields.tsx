import type { InstitutionUserDataField } from "@prisma/client";
import clsx from "clsx";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AdvancedOptionReveal from "@/src/components/reusable/advanced-options-reveal";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { CreateUserWithDataFieldsSchema } from "./schema";

type AddUserDataFieldsProps = {
  fields: InstitutionUserDataField[];
  control: Control<CreateUserWithDataFieldsSchema>;
};

export function UserDataFields({ fields, control }: AddUserDataFieldsProps) {
  const { t } = useTranslation("page");
  return (
    <AdvancedOptionReveal
      alternateText="create-user-dialog.option_reveal"
      className="relative  mt-0"
    >
      <form
        className={clsx(
          "grid max-h-[170px] gap-4 overflow-y-scroll rounded-md border border-border p-2",
          fields.length > 1 && "grid-cols-2 ",
        )}
      >
        {fields.map((field, idx) => (
          <div key={field.id} className="space-y-2">
            <p className="text-sm text-contrast">{field.name}</p>
            <Controller
              name={`fields.${idx}.value`}
              control={control}
              render={({ field }) => (
                <Input placeholder={t("general.optional")} {...field} />
              )}
            />
          </div>
        ))}
      </form>
    </AdvancedOptionReveal>
  );
}
