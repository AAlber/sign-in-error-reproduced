import { GripVertical } from "lucide-react";
import { useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import { getElementTypeFromTask as getElementTypeFromTypeId } from "@/src/client-functions/client-workbench";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { WorkbenchElement } from "../../types";
import ElementOptionsDelete from "./delete";
import ElementOptionsDuplicate from "./duplicate";

export default function WorkbenchElementOptions({
  element,
  provided,
  isHovering,
}: {
  element: WorkbenchElement;
  provided: any;
  isHovering: boolean;
}) {
  const elementType = getElementTypeFromTypeId(element.type);

  const [disabled, setDisabled] = useState(false);

  const handleOnClick = () => {
    if (disabled === false) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };

  return (
    <div
      className={classNames(
        `absolute -left-9 top-0 h-10 w-10 text-left`,
        isHovering ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      {...provided.dragHandleProps}
      onMouseLeave={() => {
        setDisabled(false);
      }}
    >
      <DropdownMenu open={disabled}>
        <div className="h-10 w-10">
          <DropdownMenuTrigger
            asChild
            className="absolute z-40"
            disabled={true}
            onClick={() => handleOnClick()}
            onMouseDown={(e) => {
              e.preventDefault();
              setDisabled(false);
            }}
          >
            <Button
              size={"icon"}
              disabled={disabled}
              variant={"ghost"}
              className={classNames(
                "outline-none ring-0 transition-opacity",
                disabled ? "opacity-40 hover:bg-transparent" : "opacity-100",
              )}
            >
              <GripVertical
                className={classNames(
                  "h-5 w-5 text-muted-contrast",
                  disabled
                    ? "cursor-not-allowed"
                    : "cursor-grab active:cursor-grabbing",
                )}
              />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent
          onMouseLeave={() => {
            setDisabled(false);
          }}
        >
          <DropdownMenuGroup>
            {elementType.elementSpecificMenuItems && (
              <>{elementType.elementSpecificMenuItems(element.id)}</>
            )}
          </DropdownMenuGroup>
          {elementType.elementSpecificMenuItems && <DropdownMenuSeparator />}
          <DropdownMenuGroup>
            <ElementOptionsDuplicate elementId={element.id} />
            <ElementOptionsDelete elementId={element.id} />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
