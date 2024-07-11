import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useUserLayerManagement from "../../../../popups/layer-user-management/zustand";

export default function LayerOptions({ layer }: any) {
  const { init } = useUserLayerManagement();
  const { t } = useTranslation("page");

  return (
    <DropdownMenuItem
      data-testid="button-option-manage-students"
      className="flex w-full px-2 "
      onClick={() =>
        init({
          layerId: layer.id,
          title: layer.name,
        })
      }
    >
      <Users className="mt-1 h-4 w-4 text-contrast" />
      <span className="text-sm text-contrast">
        {t("admin_dashboard.layer_options_manage_users")}
      </span>
    </DropdownMenuItem>
  );
}
