import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import useUser from "@/src/zustand/user";
import { PopoverStringInput } from "../../reusable/popover-string-input";
import { Button } from "../../reusable/shadcn-ui/button";
import useAdministration from "../zustand";
import Breadcrumbs from "./breadcrumbs";

import LearnStructure from "./learn-menu";
import Search from "./search";
import FoldAllLayers from "./fold-layers";

export default function AdministrationToolbar() {
  const user = useUser((state) => state.user);
  const { currentLayer, rootFlatLayer } = useAdministration();
  const { t } = useTranslation("page");

  const isInInstitutionRootLayer =
    structureHandler.utils.layerTree.getHierarchyPath(
      currentLayer,
      rootFlatLayer ?? [],
    ).length === 0;

  return (
    <div
      className="flex min-w-full grow justify-between border-border"
      aria-label="Administration Header"
    >
      <div className="flex grow items-center gap-1">
        <Search />
        <FoldAllLayers />
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-2">
        <LearnStructure />
        <PopoverStringInput
          actionName="general.create"
          onSubmit={async (name) => {
            if (!hasActiveSubscription()) {
              return toastNoSubscription();
            }
            structureHandler.create.layer({
              institution_id: user.currentInstitutionId,
              isCourse: false,
              name: name,
              parent_id: isInInstitutionRootLayer
                ? user.currentInstitutionId
                : currentLayer,
            });
          }}
        >
          <Button>
            <Plus className="mr-1 size-4" />
            {t("admin_dashboard.table_header_create_layer_button")}
          </Button>
        </PopoverStringInput>
        <PopoverStringInput
          actionName="general.create"
          onSubmit={async (name) => {
            if (!hasActiveSubscription()) {
              return toastNoSubscription();
            }
            structureHandler.create.layer({
              institution_id: user.currentInstitutionId,
              isCourse: true,
              isLinkedCourse: false,
              name: name,
              parent_id: isInInstitutionRootLayer
                ? user.currentInstitutionId
                : currentLayer,
            });
          }}
        >
          <Button variant={"cta"}>
            <Plus className="mr-1 size-4" />
            {t("admin_dashboard.table_header_create_course_button")}
          </Button>
        </PopoverStringInput>
      </div>
    </div>
  );
}
