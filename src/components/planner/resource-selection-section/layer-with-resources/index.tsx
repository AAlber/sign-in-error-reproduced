import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import Spinner from "@/src/components/spinner";
import type { PlannerLayerWithAvailableResources } from "@/src/types/planner/planner.types";
import { AutoLayerCourseIconDisplay } from "../../../reusable/course-layer-icons";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../reusable/shadcn-ui/accordion";
import usePlanner from "../../zustand";
import OrganizerResourceSelector from "./organizers";
import RoomResourceSelector from "./rooms";

export default function LayerWithResources({
  layer,
}: {
  layer: PlannerLayerWithAvailableResources;
}) {
  const { removeLayer } = usePlanner();
  const { t } = useTranslation("page");

  return (
    <AccordionItem value={layer.layer.id} key={layer.layer.id}>
      <AccordionTrigger className="px-4">
        <div className="flex items-center gap-2">
          {layer.layer.loadingUnavailabilities ? (
            <Spinner />
          ) : (
            <AutoLayerCourseIconDisplay
              course={layer.layer.course}
              className="h-5 w-5"
            />
          )}
          {layer.layer.name}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <OrganizerResourceSelector layer={layer} />
        <RoomResourceSelector layer={layer} />
        <div className="mt-4 w-full px-4">
          <Button
            className="w-full text-destructive"
            variant="ghost"
            onClick={() => removeLayer(layer.layer.id)}
          >
            {t("general.remove")}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
