import { Draggable } from "react-beautiful-dnd";
import classNames from "@/src/client-functions/client-utils";
import Badge from "@/src/components/reusable/badges/badge";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/context-menu";
import type { WorkbenchPage } from "@/src/components/workbench-deprecated/types";
import useWorkbench from "../../zustand";
import WBPageContentMenu from "./page-content-menu";

export default function WBPageItem({
  page,
  index,
}: {
  page: WorkbenchPage;
  index: number;
}) {
  const { currentPage, setCurrentPage } = useWorkbench();

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
                currentPage === page.id
                  ? "bg-primary/20 text-primary"
                  : "text-muted-contrast",
              )}
            >
              {page.new && (
                <div className="absolute right-3 top-1 z-50">
                  <Badge title="New" color="blue" />
                </div>
              )}
              <div
                onClick={() => setCurrentPage(page.id)}
                className={classNames(
                  currentPage === page.id ? "border-primary" : "border-border",
                  "h-20 w-full overflow-hidden rounded-[3px] border bg-foreground shadow-md hover:opacity-80 ",
                )}
              >
                <div
                  id={`document-thumbnail-${page.id}-workbench`}
                  className={classNames(
                    "pointer-events-none w-full",
                    "-mt-[15px] [&_>div]:min-w-[1160px] [&_>div]:origin-top-left [&_>div]:scale-[0.1]",
                  )}
                />
                {!!page.thumbnail ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img
                    src={page.thumbnail}
                    className="h-full w-full"
                    alt="bl"
                  />
                ) : (
                  <>{/* RENDER THUMBNAIL DYNAMICALLY HERE */}</>
                )}
              </div>
              {index + 1}
            </div>
          )}
        </Draggable>
      </ContextMenuTrigger>
      <WBPageContentMenu page={page} index={index} />
    </ContextMenu>
  );
}
