import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Fragment, useEffect } from "react";
import classNames from "@/src/client-functions/client-utils";
import PageNavigation from "./navigation";
import PageContent from "./page-content";
import ModalButtons from "./page-navigation";
import { useModal } from "./zustand";

export type MultiPageModalProps = {
  open: boolean;
  title: string;
  finishButtonText: string;
  finishButtonDanger?: boolean;
  finishButtonDisabled?: boolean;
  additionalButton?: JSX.Element;
  noButtons?: boolean;
  onFinish: () => Promise<void>;
  onClose: () => void;
  setOpen: (open: boolean) => void;
  height?: "auto" | "md" | "lg" | "xl" | "2xl";
  customHeight?: string;
  useTabsInsteadOfSteps?: boolean;
  pages: ModalPage[];
  maxWidth?: `max-w-${string}`;
};

export type ModalPage = {
  title: string;
  beta?: boolean;
  tabTitle?: string;
  tabIcon?: JSX.Element;
  description: string;
  onNextClick?: (step: number) => Promise<boolean>;
  nextStepRequirement: () => boolean;
  children?: React.ReactNode;
};

export default function MultiPageModal({
  height = "auto",
  ...props
}: MultiPageModalProps) {
  const { reset, setTotalSteps } = useModal();

  useEffect(() => {
    if (!props.open) return;
    reset();
    setTotalSteps(props.pages.length);
  }, [props.open]);

  const getHeight = () => {
    switch (height) {
      case "md":
        return "h-[465px]";
      case "lg":
        return "h-[500px]";
      case "xl":
        return "h-[700px]";
      case "2xl":
        return "h-[800px]";
      default:
        return "h-auto";
    }
  };

  return (
    <div className="pointer-events-none absolute z-[1000] w-screen">
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (props.pages.length < 2 || props.useTabsInsteadOfSteps)
              return props.setOpen(false);
            console.log("Not allowed on multi page modal");
          }}
        >
          <div className="fixed inset-0 overflow-y-auto">
            <div className="inset-0 z-50 flex min-h-full items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <motion.div
                  transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
                  layout
                  className={classNames(
                    height !== "auto" && getHeight(),
                    props.pages.length < 2
                      ? props.maxWidth ?? "md:max-w-xl"
                      : "md:max-w-3xl",
                    "milkblur pointer-events-auto relative mx-2 overflow-hidden rounded-lg border border-border bg-popover text-left shadow-xl sm:my-8 md:w-full",
                  )}
                >
                  <Dialog.Panel>
                    <button
                      className="absolute right-0 top-0 p-4"
                      onClick={() => props.setOpen(false)}
                    >
                      <X size={20} />
                    </button>
                    <motion.div layout="position" className="flex flex-col">
                      <main className="grid grid-cols-4">
                        <PageNavigation
                          steps={props.pages}
                          useTabsInsteadOfSteps={props.useTabsInsteadOfSteps}
                        />
                        <div
                          className={classNames(
                            height !== "auto" && getHeight(),
                            props.pages.length < 2
                              ? "col-span-4"
                              : "col-span-4 md:col-span-3 ",
                            "flex flex-col justify-between gap-2 overflow-y-scroll px-4 pb-4 pt-4",
                          )}
                        >
                          <PageContent steps={props.pages} />
                          <ModalButtons {...props} height={height} />
                        </div>
                      </main>
                    </motion.div>
                  </Dialog.Panel>
                </motion.div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
