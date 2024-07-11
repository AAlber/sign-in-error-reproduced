import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench, { WorkbenchMode } from "../../zustand";

export default function WBSimplePageNavigation() {
  const { getPages, currentPage, mode, getIndexOfPage, setCurrentPage } =
    useWorkbench();

  const { t } = useTranslation("page");

  if (mode === WorkbenchMode.CREATE) return null;

  return (
    <nav
      className="absolute bottom-3 right-3 z-20 flex items-center justify-between gap-2 rounded-lg border border-border bg-foreground px-3 py-2"
      aria-label="Pagination"
    >
      <div className="mr-3 hidden sm:block">
        <p className="text-sm text-muted-contrast">
          {t("workbench.page_text1")}{" "}
          <span className="font-medium text-contrast">
            {getIndexOfPage(currentPage) + 1}
          </span>{" "}
          {t("workbench.page_text2")} {getPages().length}{" "}
          {t("workbench.page_text3")}
        </p>
      </div>
      <Button
        onClick={() => {
          if (!getPages()[getIndexOfPage(currentPage) - 1]) return;
          setCurrentPage(getPages()[getIndexOfPage(currentPage) - 1]!.id);
        }}
        enabled={getPages()[getIndexOfPage(currentPage) - 1] ? true : false}
      >
        {t("workbench.simple_page_navigator_previous")}
      </Button>
      <Button
        variant={"cta"}
        onClick={() => {
          if (!getPages()[getIndexOfPage(currentPage) + 1]) return;
          setCurrentPage(getPages()[getIndexOfPage(currentPage) + 1]!.id);
        }}
        enabled={getPages()[getIndexOfPage(currentPage) + 1] ? true : false}
      >
        {t("workbench.simple_page_navigator_next")}
      </Button>
    </nav>
  );
}
