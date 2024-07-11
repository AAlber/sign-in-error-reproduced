import React from "react";
import { useTranslation } from "react-i18next";
import Switch from "@/src/components/reusable/settings-switches/switch";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

type Props = {
  checked: boolean;
  label: string;
  description?: string;
  onChange: (bool: boolean) => void;
};

export default function ExportPreferenceSwitch({
  checked,
  label,
  description,
  onChange,
}: Props) {
  const { t } = useTranslation("page");
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <div className="col-span-3 flex flex-col">
        <Label htmlFor="send_invite">{t(label)}</Label>
        {description && (
          <p className="text-xs text-muted-contrast">{t(description)}</p>
        )}
      </div>
      <div className="col-span-1 flex items-center justify-end">
        <Switch checked={checked} onChange={onChange} />
      </div>
    </div>
  );
}
