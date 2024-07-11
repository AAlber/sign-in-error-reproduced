import { User } from "lucide-react";
import prettyBytes from "pretty-bytes";
import useUserLayerManagement from "@/src/components/popups/layer-user-management/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import type { Layer } from "../../types";
import MoreMenu from "./more-menu";
import PlusMenu from "./plus-menu";

export default function LayerOptions({ layer }: { layer: Layer }) {
  const { init, layerBeingHovered } = useUserLayerManagement();

  return (
    <div className="absolute right-4 flex items-center justify-end">
      {layerBeingHovered === layer.id && (
        <div className={"opacity text-xs text-muted-contrast"}>
          {prettyBytes(layer.storageUsage || 0)}
        </div>
      )}
      {!layer.isCourse && <PlusMenu layerId={String(layer.id)} />}
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => {
          init({
            layerId: layer.id as string,
            title: layer.name,
          });
        }}
      >
        <User size={18} className="text-muted-contrast" />
      </Button>
      <MoreMenu layer={layer} />
    </div>
  );
}
