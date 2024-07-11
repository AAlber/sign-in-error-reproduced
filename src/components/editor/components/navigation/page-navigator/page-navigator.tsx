import { ChevronLeft, ChevronRight } from "lucide-react";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useEditor } from "../../../zustand";

export default function PageNavigator() {
  const { getPages } = useEditor();

  if (getPages().length <= 1) return null;

  return (
    <div className="flex w-full gap-2 border-t border-border bg-foreground p-2 lg:flex-col lg:p-4">
      <Pages />
      <PageNavigatorArrows />
    </div>
  );
}

function PageNavigatorArrows() {
  const {
    data,
    currentPageId,
    goToNextPage,
    goToPreviousPage,
    canChangePage,
    getIndexOfPage,
  } = useEditor();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={!canChangePage("previous")}
        onClick={goToPreviousPage}
      >
        <ChevronLeft />
      </Button>
      <div className="hidden select-none text-muted-contrast lg:flex">
        {getIndexOfPage(currentPageId) + 1} / {data.pages.length}
      </div>
      <Button
        variant={"ghost"}
        size={"icon"}
        onClick={goToNextPage}
        disabled={!canChangePage("next")}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

function Pages() {
  const { data, currentPageId, setCurrentPageId, getIndexOfPage } = useEditor();

  return (
    <div className="flex w-full items-center gap-1">
      {data.pages.map((page, index) => (
        <button
          key={page.id}
          onClick={() => setCurrentPageId(page.id)}
          className={classNames(
            index === getIndexOfPage(currentPageId)
              ? "h-4 rounded-sm bg-primary"
              : index < getIndexOfPage(currentPageId)
              ? "h-3 rounded-sm bg-muted-contrast"
              : "h-3 rounded-sm bg-muted",
            " w-full",
          )}
        />
      ))}
    </div>
  );
}
