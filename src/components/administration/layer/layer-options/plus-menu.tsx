import { CornerDownLeft } from "lucide-react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import NewCourse from "./plus-menu-options/new-course";
import NewLayer from "./plus-menu-options/new-layer";

export default function PlusMenu({ layerId }: { layerId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Button size={"icon"} variant={"ghost"}>
          <CornerDownLeft
            aria-hidden="true"
            size={18}
            className="text-muted-contrast"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mr-5 w-[200px]  opacity-100 !shadow-none focus:outline-none"
      >
        <DropdownMenuGroup>
          <NewLayer layerId={layerId} />
          <NewCourse layerId={layerId} />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
