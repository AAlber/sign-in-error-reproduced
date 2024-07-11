import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import classNames from "@/src/client-functions/client-utils";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { EditorPage } from "../../../types";
import { useEditor } from "../../../zustand";
import PageContentMenu from "./context-menu";
import { ThumbnailGenerator } from "./thumbnail-generator";

export default function Page({
  page,
  index,
}: {
  page: EditorPage;
  index: number;
}) {
  const { currentPageId, setCurrentPageId: setCurrentPage } = useEditor();
  const [isThumbnailGenerated, setIsThumbnailGenerated] =
    useState<boolean>(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsThumbnailGenerated(false);
  }, [resolvedTheme]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Draggable draggableId={`workbench-page-item-${page.id}`} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className={classNames(
                "relative mt-1 flex cursor-default select-none items-center gap-2 rounded-l-lg px-3 py-2 text-xs",
                currentPageId === page.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-contrast",
              )}
            >
              <div
                onClick={() => setCurrentPage(page.id)}
                className={classNames(
                  currentPageId === page.id
                    ? "border-primary"
                    : "border-border",
                  "h-20 w-full overflow-hidden rounded-md border bg-foreground shadow-md hover:opacity-80",
                )}
              >
                <div
                  id={`document-thumbnail-${page.id}-workbench`}
                  className={classNames(
                    "pointer-events-none relative w-full",
                    // "-mt-[15px] [&_>div]:min-w-[1160px] [&_>div]:origin-top-left [&_>div]:scale-[0.1]",
                  )}
                >
                  {page.thumbnail && (
                    <Image
                      src={page.thumbnail}
                      alt="thumbnail"
                      width={50}
                      height={50}
                      className="size-full"
                    />
                  )}
                </div>
              </div>
              {index + 1}
            </div>
          )}
        </Draggable>
      </ContextMenuTrigger>
      {!isThumbnailGenerated && (
        <ThumbnailGenerator
          page={page}
          setIsThumbnailGenerated={setIsThumbnailGenerated}
        />
      )}
      <PageContentMenu page={page} index={index} />
    </ContextMenu>
  );
}
