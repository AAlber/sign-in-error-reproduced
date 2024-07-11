import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import type { LayerUserHasAccessTo } from "@/src/types/user.types";

export default function LayerOption({
  layer,
}: {
  layer: LayerUserHasAccessTo;
}) {
  return (
    <div className="flex w-full items-center justify-start gap-3">
      <div className="flex items-center gap-2 font-medium text-contrast">
        <div className="w-5">
          <AutoLayerCourseIconDisplay
            course={layer.course}
            className="h-5 w-5"
          />
        </div>
        <span>
          {structureHandler.utils.layerTree.getLayerNameToShow(layer)}
        </span>
      </div>
    </div>
  );
}
