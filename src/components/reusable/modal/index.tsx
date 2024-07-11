import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "../shadcn-ui/button";

export type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: React.ReactNode;
  noCloseButton?: boolean;
  className?: string;
  allowCloseOnEscapeOrClickOutside?: boolean;
};

export default function Modal({
  size = "md",
  allowCloseOnEscapeOrClickOutside = true,
  noCloseButton = false,
  ...props
}: ModalProps) {
  return (
    <div className="pointer-events-none absolute z-[1000] w-screen">
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            if (allowCloseOnEscapeOrClickOutside) return props.setOpen(false);
          }}
        >
          <div className="fixed inset-0 overflow-y-hidden">
            <div className="inset-0 z-50 flex min-h-full items-center justify-center bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <div
                  className={classNames(
                    size === "xs" && "max-w-xs",
                    size === "sm" && "max-w-md",
                    size === "md" && "max-w-xl",
                    size === "lg" && "max-w-3xl",
                    size === "xl" && "max-w-4xl",
                    size === "2xl" && "max-w-5xl",
                    "milkblur pointer-events-auto relative m-2 transform rounded-lg border border-border bg-popover text-left shadow-xl transition-all duration-200 ease-out sm:my-8 sm:w-full",
                  )}
                >
                  <Dialog.Panel className="w-full">
                    <div className="w-full">
                      {!noCloseButton && (
                        <div className="bg-background-red absolute right-0 top-0 z-50 p-4">
                          <Button
                            variant={"ghost"}
                            size={"iconSm"}
                            className=""
                            onClick={() => {
                              props.setOpen(false);
                            }}
                          >
                            <X size={20} />
                          </Button>
                        </div>
                      )}
                      <main
                        className={classNames("w-full p-4", props.className)}
                      >
                        {props.children}
                      </main>
                    </div>
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
