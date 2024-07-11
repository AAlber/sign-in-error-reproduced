import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import confirmAction from "@/src/client-functions/client-options-modal";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { log } from "@/src/utils/logger/logger";
import type { Layer } from "../../../types";
import useAdministration from "../../../zustand";

export default function DeleteLayer({ layer }: { layer: Layer }) {
  const { t } = useTranslation("page");

  const handleOnClick = async () => {
    log.click("Layer delete button");
    if (layer.isCourse || layer.children.length > 0) {
      confirmAction(
        async () => {
          await deleteLayerById(layer.id);
        },
        {
          title: layer.isCourse ? "delete_course" : "delete_layer",
          description: layer.isCourse
            ? "delete_course_description"
            : "delete_layer_description",
          actionName: "general.delete",
          requiredConfirmationCode: true,
          dangerousAction: true,
          confirmationCode: layer.isCourse ? undefined : layer.name,
          confirmationCodePlaceholder: "delete_layer_placeholder",
          displayComponent: () => (
            <div
              key={layer.id}
              className="mb-6 flex items-center gap-2 rounded-md border border-border p-4"
            >
              <AutoLayerCourseIconDisplay
                course={layer.course || null}
                className="size-6"
                height={24}
                width={24}
              />
              <div className="font-medium text-contrast">{layer.name}</div>
            </div>
          ),
        },
      );
    } else {
      await deleteLayerById(layer.id);
    }
  };

  const deleteLayerById = async (layerId) => {
    const id = String(layerId);
    await structureHandler.delete.layer(id);

    const { currentLayer } = useAdministration.getState();

    if (layer.parent_id === currentLayer) {
      const element = document.getElementById(id);
      element?.style.setProperty("position", "absolute");
      element?.style.setProperty("right", "-9999px");
    }
  };

  return (
    <DropdownMenuItem
      data-testid="button-option-create-invite"
      className="flex w-full px-2"
      onClick={handleOnClick}
    >
      <Trash className="size-4 text-destructive" />
      <span className="text-sm text-destructive">{t("general.delete")}</span>
    </DropdownMenuItem>
  );
}
