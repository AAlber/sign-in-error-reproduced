import { ListTree } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ContextMenuItem } from "@/src/components/reusable/shadcn-ui/context-menu";
import useUser from "@/src/zustand/user";
import useAdministration from "../../administration/zustand";
import { useNavigation } from "../../dashboard/navigation/zustand";
import useDashboard from "../../dashboard/zustand";
import { useShowInStructure } from "./hooks/useShowInStructure";

type Props = {
  layerId: string;
};

export default function ShowInStructure({ layerId }: Props) {
  const { t } = useTranslation("page");
  const { data, loading, error } = useShowInStructure(layerId);
  const { setHighlightedLayerId } = useDashboard();
  const currentInstitutionId = useUser(
    (state) => state.user.currentInstitutionId,
  );
  const { setPage } = useNavigation();
  const setCurrentLayer = useAdministration((state) => state.setCurrentLayer);

  const handleShowInStructure = () => {
    setHighlightedLayerId(layerId);
    setPage("STRUCTURE");
    setCurrentLayer(currentInstitutionId);
  };

  return (
    <ContextMenuItem
      data-testid="button-option-create-invite"
      className="flex w-full px-2"
      onClick={handleShowInStructure}
    >
      {loading && (
        <div className="text-muted-contrast">{t("general.loading")}</div>
      )}
      {error && (
        <div className="text-destructive">{t("error_loading_layerpath")}</div>
      )}
      {!loading && data && (
        <>
          <ListTree className="h-4 w-4" />
          <span className="text-sm">{t("show_in_structure")}</span>
        </>
      )}
    </ContextMenuItem>
  );
}
