import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { log } from "@/src/utils/logger/logger";
import type { Layer } from "../types";
import useAdministration from "../zustand";

export default function Snippet(props: {
  content: { id: string; name: string }[];
}) {
  const { content } = props;
  const { setCurrentLayer, setLayerTree_, rootFlatLayer } = useAdministration();

  const handleClick = (id: string) => () => {
    log.click("Clicked breadcrumb in structure");
    setCurrentLayer(id);
    const layer = rootFlatLayer?.find((i) => i.id === id);
    if (layer) {
      const newTree = structureHandler.utils.layerTree.normalizeTree(
        layer as Layer,
      );
      setLayerTree_(newTree);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="text-muted-contrast hover:text-contrast">
        ...
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-5 w-auto border-border opacity-100 !shadow-none focus:outline-none ">
        <DropdownMenuGroup className="">
          {content.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className=" text-muted-contrast hover:text-contrast"
            >
              <button
                className="w-full text-left text-sm text-contrast "
                onClick={handleClick(item.id)}
              >
                {item.name}
              </button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
