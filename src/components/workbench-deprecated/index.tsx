import {
  DndContext,
  DragOverlay,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setTimeout } from "timers";
import confirmAction from "@/src/client-functions/client-options-modal";
import classNames from "@/src/client-functions/client-utils";
import { handleDragEnd } from "@/src/client-functions/client-workbench";
import { sleep } from "@/src/utils/utils";
import ErrorBoundary from "../error-boundary";
import Spinner from "../spinner";
import AIAssistant from "./ai-assistant";
import WBDocument from "./components/document";
import DraggingOverlay from "./components/drag-overlay";
import WBPageNavigator from "./components/page-navigator";
import WBSimplePageNavigation from "./components/page-navigator/simple-page-nav";
import Sidebar from "./components/sidebar";
import elementTypes from "./elements/element-types";
import WorkbenchNavigation from "./navigation";
import useWorkbench, { WorkbenchMode } from "./zustand";

export default function WithErrorBoundary() {
  const { t } = useTranslation("page");
  const { reset } = useWorkbench();

  return (
    <ErrorBoundary
      resetButtonText={t("reset")}
      onReset={(_error, close) => {
        function handleClose() {
          setTimeout(() => {
            reset();
            close();
          }, 400);
        }

        confirmAction(handleClose, {
          actionName: t("reset"),
          description: t("workbench.error.action.reset_description"),
          title: t("workbench.error.action.reset_workbench"),
          cancelName: t("workbench.error.action.reset_cancel"),
          onCancel: close,
        });
      }}
    >
      <Workbench />
    </ErrorBoundary>
  );
}

function Workbench() {
  const { mode, open } = useWorkbench();

  const [element, setElement] = useState<any>({});

  const handleDragStart = (event) => {
    elementTypes.filter((item: any, index: number) => {
      if (item?.id === event.active.id) {
        setElement(elementTypes[index]);
      }
    });
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => console.log("lol")}
      >
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-auto fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen">
                  <div className="flex h-full flex-col overflow-y-scroll border-border bg-background shadow-xl">
                    <WorkbenchNavigation />
                    {open && (
                      <DndContext
                        sensors={sensors}
                        onDragEnd={(event) => {
                          setElement({});
                          handleDragEnd(event);
                        }}
                        onDragStart={handleDragStart}
                        autoScroll={{ threshold: { x: 0, y: 0.2 } }}
                      >
                        <div className="flex h-full overflow-hidden">
                          {mode === WorkbenchMode.CREATE && <Sidebar />}
                          <MemoizedWorkbenchComponents />
                        </div>

                        <DragOverlay data-testid={`test_element_id`}>
                          {element?.id ? (
                            <DraggingOverlay
                              data-testid={`test_element_id`}
                              element={element}
                            />
                          ) : null}
                        </DragOverlay>
                      </DndContext>
                    )}
                  </div>
                  {mode === WorkbenchMode.CREATE && <AIAssistant />}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const WorkBenchComponents = () => {
  const { content, mode, setCurrentPage } = useWorkbench();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode !== WorkbenchMode.CREATE) return;
    async function initThumbnails() {
      const pages = content.pages;

      if (pages.length > 1) {
        setIsLoading(true);

        /**
         * Make loading animation show for a
         * while at first
         */
        await sleep(600);

        for (const page of pages) {
          setCurrentPage(page.id);
          await sleep(100);
        }

        if (pages[0]?.id) {
          setCurrentPage(pages[0].id);
        }
      }

      return true;
    }

    initThumbnails()
      .catch(console.log)
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading && (
        <div className="absolute z-50 flex size-full items-center justify-center bg-background">
          <Spinner size="h-10 w-10" />
        </div>
      )}
      <div className={classNames(isLoading && "hidden", "flex w-full")}>
        <WBDocument />
        <WBSimplePageNavigation />
        <WBPageNavigator />
      </div>
    </>
  );
};

const MemoizedWorkbenchComponents = React.memo(WorkBenchComponents);
