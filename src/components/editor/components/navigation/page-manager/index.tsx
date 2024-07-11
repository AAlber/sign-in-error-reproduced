import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useEditor } from "../../../zustand";
import PageList from "./page-list";

export const PageManager = () => {
  const { addPage } = useEditor();
  const { t } = useTranslation("page");

  return (
    <div className="hidden w-[170px]  min-w-[170px] gap-y-2 overflow-y-scroll border-l border-border bg-foreground pt-3  lg:flex lg:flex-col">
      <div className="flex w-[150px] flex-col items-center justify-center pl-6 pr-1">
        <Button className="w-full" onClick={addPage}>
          {t("workbench.page_new_page")}
        </Button>
      </div>
      <PageList />
    </div>
  );
};
