import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Switch from "@/src/components/reusable/settings-switches/switch";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import type { PollSchemaType } from "@/src/types/chat/polls";

export function AllowMultipleToggle() {
  const { t } = useTranslation("page");
  const { control, setValue } = useFormContext<PollSchemaType>();

  return (
    <div className="flex justify-between">
      <Label>{t("chat.poll.create_poll.allow_multiple")}</Label>
      <Controller
        control={control}
        name="allowMultiple"
        render={({ field }) => (
          <Switch
            checked={field.value}
            onChange={(e) => {
              setValue("allowMultiple", e);
            }}
          />
        )}
      />
    </div>
  );
}
