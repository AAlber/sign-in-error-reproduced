import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import AsyncSelect from "@/src/components/reusable/async-select";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import LayerSelectPathHoverCard from "@/src/components/reusable/layer-select-path-card";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useAccessPassCreator } from "../../zustand";

export default function AccessPassLayerSelector() {
  const { setLayer, layer } = useAccessPassCreator();
  const { t } = useTranslation("page");

  return (
    <>
      <div className="py-2">{t("layer")}</div>
      <AsyncSelect
        placeholder={"layer_selector_placeholder"}
        noDataMessage={"layer_selector_no_layers_to_select"}
        fetchData={() =>
          structureHandler.get.layersUserHasSpecialAccessTo(false)
        }
        onSelect={(item) => {
          setLayer(item);
        }}
        searchValue={(item) => item.name + item.id}
        openWithShortcut={false}
        trigger={
          <Button>
            {layer ? layer.name : t("layer_selector_placeholder")}
          </Button>
        }
        itemComponent={(layer) => (
          <p className="flex items-center gap-2 font-medium text-contrast">
            <AutoLayerCourseIconDisplay
              course={layer.course}
              className="h-5 w-5"
            />
            <span>{layer.name}</span>
          </p>
        )}
        renderHoverCard={true}
        hoverCard={(item) => <LayerSelectPathHoverCard layer={item} />}
      />
    </>
  );
}
