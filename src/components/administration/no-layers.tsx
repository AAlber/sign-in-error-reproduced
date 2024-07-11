import { PackageOpen, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import useUser from "@/src/zustand/user";
import { EmptyState } from "../reusable/empty-state";
import { PopoverStringInput } from "../reusable/popover-string-input";
import { Button } from "../reusable/shadcn-ui/button";
import useAdministration from "./zustand";

export default function NoLayers() {
  const { currentLayer } = useAdministration();
  const { t } = useTranslation("page");
  const { user: user } = useUser();

  return (
    <EmptyState
      title="admin_dashboard.no_layers_title"
      description="admin_dashboard.no_layers_text"
      icon={PackageOpen}
      size="xlarge"
      withBlurEffect
    >
      <div className="flex items-center gap-2 py-4">
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
              parent_id: currentLayer,
            });
          }}
        >
          <Button>
            <Plus className="mr-1 h-4 w-4" />
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
              name: name,
              isLinkedCourse: false,
              parent_id: currentLayer,
            });
          }}
        >
          <Button variant={"cta"}>
            <Plus className="mr-1 h-4 w-4" />
            {t("admin_dashboard.table_header_create_course_button")}
          </Button>
        </PopoverStringInput>
      </div>
      <EmptyState.LearnTrigger triggerId="welcome-learn-menu" />
    </EmptyState>
  );
}
