import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { handleClose } from "@/src/client-functions/client-workbench";
import ToolButtons from "../components/tool-buttons";
import useWorkbench, { WorkbenchMode } from "../zustand";
import { WorkbenchMenubar } from "./menu";

function WorkbenchNavigation() {
  const { mode } = useWorkbench();
  const { t } = useTranslation("page");

  return (
    <div className="sticky top-0 z-10 flex h-12 w-screen border-b border-border bg-background pl-4 pr-2 ">
      <div className="flex flex-1 items-center">
        <Dialog.Title className="flex w-full items-center font-medium text-contrast">
          <div className="flex h-full items-center gap-2">
            <div className="flex h-7 items-center font-semibold">
              <span className="sr-only">Close panel</span>
              <X
                onClick={handleClose}
                className="mr-2 h-5 w-5 cursor-pointer  text-contrast"
                aria-hidden="true"
              />
              {t("workbench_header_title")}
            </div>
          </div>
          <WorkbenchMenubar />
        </Dialog.Title>
      </div>

      <div className="flex gap-x-2">
        {mode !== WorkbenchMode.READONLY && <ToolButtons />}
      </div>
    </div>
  );
}

export default React.memo(WorkbenchNavigation);
