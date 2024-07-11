import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useLayerSettings from "../../../../popups/layer-settings/zustand";

export default function LayerOptions({ layer }: any) {
  const { init } = useLayerSettings();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-settings"
      className="flex w-full px-2 "
      onClick={() => init({ layer })}
    >
      <Settings className="mt-1 h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("admin_dashboard.layer_options_settings")}
      </span>
    </DropdownMenuItem>
  );
}
