import { MoreHorizontal } from "lucide-react";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { Layer } from "../../types";
import CreateLinkedCourse from "./more-menu-options/create-linked-course";
import DeleteLayer from "./more-menu-options/delete-layer";
import ImportCourse from "./more-menu-options/import-course-data";
import MenuManageUsers from "./more-menu-options/manage-users";
import MenuNewAppointments from "./more-menu-options/new-appointments";
import MenuSettings from "./more-menu-options/settings";
import UnlinkCoursesMenuOption from "./more-menu-options/unlink-courses";

export default function MoreMenu({ layer }: { layer: Layer }) {
  const linkedCoursesIfAny =
    structureHandler.utils.layerTree.getLinkedCoursesOfCourse(layer.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal
            data-testid="cy-layer-option-ellipsis"
            aria-hidden="true"
            size={18}
            className="text-muted-contrast"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
        className="mr-5 w-[200px] divide-border opacity-100 !shadow-none ring-opacity-5 focus:outline-none "
      >
        {!layer.isLinkedCourse && (
          <DropdownMenuGroup>
            <MenuNewAppointments layer={layer} />
          </DropdownMenuGroup>
        )}
        {!layer.isLinkedCourse && (
          <DropdownMenuSeparator className="bg-border" />
        )}
        {layer.isCourse && !layer.isLinkedCourse && (
          <ImportCourse layer={layer} />
        )}
        {layer.isCourse && !layer.isLinkedCourse && (
          <CreateLinkedCourse layer={layer} />
        )}
        {!!linkedCoursesIfAny?.length && (
          <UnlinkCoursesMenuOption layer={layer} />
        )}
        {!layer.isLinkedCourse && layer.isCourse && (
          <DropdownMenuSeparator className="bg-border" />
        )}
        <DropdownMenuGroup className="[&>div]:cursor-pointer">
          <MenuManageUsers layer={layer} />

          <MenuSettings layer={layer} />
          {layer.isCourse && <DropdownMenuSeparator />}
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DeleteLayer layer={layer} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
