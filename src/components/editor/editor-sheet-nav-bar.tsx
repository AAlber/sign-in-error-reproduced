import * as SheetPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import React from "react";
import { courseDrive } from "@/src/client-functions/client-drive/drive-builder";
import { deleteEditorFileNodes } from "@/src/client-functions/client-editor";
import confirmAction from "@/src/client-functions/client-options-modal";
import classNames from "@/src/client-functions/client-utils";
import useCourse from "../course/zustand";
import { Button } from "../reusable/shadcn-ui/button";
import { useEditor } from "./zustand";

export const SheetNavBar = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>
>(({ title, className, ...props }, ref) => {
  const { setOpen, getCurrentPageContent, data, originBlockId } = useEditor();
  const { course } = useCourse();

  const handleCloseClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const currentPageContent = getCurrentPageContent();
    if (currentPageContent) {
      confirmAction(
        () => {
          const toDelete: { nodeType: string | undefined; src: string }[] = [];
          if (!originBlockId) {
            data.pages.forEach((page) => {
              if (page.content) {
                page.content.content?.forEach((content) => {
                  toDelete.push({
                    nodeType: content?.type,
                    src: content?.attrs?.src,
                  });
                });
              }
            });
          }
          toDelete &&
            deleteEditorFileNodes(toDelete).then(() => {
              courseDrive.api.getStorageCategories({
                type: "course-drive",
                layerId: course.layer_id,
              });
            });
          setOpen(false);
        },
        {
          title: "are_you_sure",
          description: "are_you_sure_description",
          actionName: "general.close",
          cancelName: "general.cancel",
          dangerousAction: true,
        },
      );
    } else {
      setOpen(false);
    }
  };

  return (
    <div
      ref={ref}
      className={classNames(
        "z-20 flex items-center justify-between border-b border-border bg-foreground px-2 py-1",
        className,
      )}
      {...props}
    >
      <SheetPrimitive.Close>
        <Button variant="ghost" size={"icon"} onClick={handleCloseClick}>
          <Cross2Icon className="h-4 w-4" />
        </Button>
      </SheetPrimitive.Close>
      <div className="font-medium text-contrast">{title}</div>
      {props.children}
    </div>
  );
});

SheetNavBar.displayName = "SheetNavBar";
