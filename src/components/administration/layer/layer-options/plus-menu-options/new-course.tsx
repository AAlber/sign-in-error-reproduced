import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import useInputModal from "@/src/components/popups/input-modal/zustand";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useUser from "@/src/zustand/user";
import useAdministration from "../../../zustand";

export default function NewCourse({ layerId }: { layerId: string }) {
  const { t } = useTranslation("page");
  const { layerTree_ } = useAdministration();
  const { initModal } = useInputModal();
  const { user: user } = useUser();

  return (
    <DropdownMenuItem
      className="flex w-full items-center gap-2"
      onClick={() => {
        if (!hasActiveSubscription()) {
          return toastNoSubscription();
        }

        if (!layerTree_) return console.error("layerTree_ is undefined");

        const flatTree =
          structureHandler.utils.layerTree.flattenTree(layerTree_);
        const layer = structureHandler.utils.layerTree.findLayer(
          flatTree,
          layerId,
        );

        initModal({
          title: replaceVariablesInString(t("new_subcourse"), [
            layer?.name || "",
          ]),
          description: "new_subcourse_description",
          action: "general.create",
          specialCharactersAllowed: true,
          name: "",
          onConfirm: (name) => {
            structureHandler.create.layer({
              institution_id: user.currentInstitutionId,
              isCourse: true,
              name: name,
              parent_id: layerId,
            });
          },
        });
      }}
    >
      <Plus aria-hidden="true" className="h-5 w-5 text-muted-contrast" />
      {t("admin_dashboard.layer_sublayer_new_course")}
    </DropdownMenuItem>
  );
}
