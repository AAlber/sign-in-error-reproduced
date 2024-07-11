import { ListCollapse } from "lucide-react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { Button } from "../../reusable/shadcn-ui/button";
import useAdministration from "../zustand";

export default function FoldAllLayers() {
  const { layerTree_ = [] } = useAdministration();

  const handleFoldLayers = () => {
    const foldLayersAndSublayers = (layer) => {
      structureHandler.utils.layerTree.handleCollapse(layer.id, true);

      if (layer.children?.length > 0) {
        layer.children.forEach(foldLayersAndSublayers);
      }
    };

    layerTree_.forEach(foldLayersAndSublayers);
  };

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      className="mr-2 text-muted-contrast"
      onClick={handleFoldLayers}
    >
      <ListCollapse className="size-4" />
    </Button>
  );
}
