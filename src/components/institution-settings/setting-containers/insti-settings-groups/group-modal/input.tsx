import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import ColorSelector from "@/src/components/reusable/color-selector";
import Input from "@/src/components/reusable/input";
import { useUserGroupModal } from "./zustand";

export default function GroupInput() {
  const {
    name,
    additionalInformation,
    color,
    setName,
    setAdditionalInformation,
    setColor,
  } = useUserGroupModal();
  const { t } = useTranslation("page");

  const bgColor = "bg-" + color + "-500";

  return (
    <div className="flex w-full flex-col gap-3">
      <Input
        text={name}
        setText={setName}
        placeholder={t(
          "organization_settings.user_management_group_modal_name_input_placeholder",
        )}
        maxLength={200}
      />
      <Input
        text={additionalInformation}
        setText={setAdditionalInformation}
        placeholder={t("info")}
        maxLength={500}
      />
      <ColorSelector color={color} onChange={setColor}>
        <div className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-2 hover:bg-foreground">
          <div className={classNames("h-5 w-5 rounded-full", bgColor)} />
          <span className="text-sm font-medium text-contrast">
            {t(
              "organization_settings.user_management_group_modal_color_picker",
            )}
          </span>
        </div>
      </ColorSelector>
    </div>
  );
}
