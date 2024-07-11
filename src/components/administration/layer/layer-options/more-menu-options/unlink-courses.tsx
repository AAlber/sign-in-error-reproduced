import { XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import StructurePath from "@/src/components/reusable/layer-path";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { Layer } from "../../../types";

export default function UnlinkCoursesMenuOption({ layer }: { layer: Layer }) {
  const { t } = useTranslation("page");
  const linkedCourses =
    structureHandler.utils.layerTree.getLinkedCoursesOfCourse(layer.id);

  const handleUnlinkCourse = (id: string) => async () => {
    structureHandler.delete.layer(id, true);
  };

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="flex w-full px-2 ">
          <XIcon className="h-4 w-4 text-contrast" />
          <span className="text-sm text-contrast">
            {t("admin_dashboard.layer_options_unlink-courses")}
          </span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="[&>div]:cursor-pointer">
            {linkedCourses?.map(({ id, name, parentId }) => (
              <DropdownMenuItem
                key={id}
                onClick={handleUnlinkCourse(String(id))}
                className="flex w-full items-center"
              >
                <XIcon className="h-4 w-4 text-muted-contrast" />
                <div>
                  <div className="!text-xs !text-muted-contrast">
                    <StructurePath
                      layerId={parentId?.toString() ?? id.toString()}
                    />
                  </div>
                  <div className="flex items-center">
                    <span>{name}</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}
