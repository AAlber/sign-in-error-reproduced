import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useWorkbench, { WorkbenchMode } from "../../zustand";
import WBPageList from "./page-list";

export default function WBPageNavigator() {
  const { mode, addPage } = useWorkbench();
  const { t } = useTranslation("page");
  if (mode !== WorkbenchMode.CREATE) return null;

  return (
    <div className="hidden w-[170px]  min-w-[170px] gap-y-2 overflow-y-scroll border-l border-border bg-background pt-3  lg:flex lg:flex-col">
      <div className="w-[170px] pl-3 pr-4 lg:flex lg:flex-col">
        <Button onClick={addPage}> {t("workbench.page_new_page")} </Button>
      </div>
      <WBPageList />
    </div>
  );
}
