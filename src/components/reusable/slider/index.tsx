import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "../shadcn-ui/button";
import ScreenControls from "./screen-controls";
import TransitionChildWrapper from "./transition-child-wrapper";

export default function Slider(props: SliderProps) {
  return (
    <>
      <Transition.Root show={props.open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={props.setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div
                className={classNames(
                  "pointer-events-none fixed flex",
                  props.fullScreen === true
                    ? "max-w-full"
                    : props.halfScreen === true
                    ? "max-w-[60%] pl-10 sm:pl-16"
                    : "max-w-md",
                  props.position === "bottom"
                    ? "bottom-0"
                    : "inset-y-0 right-0 top-0 ",
                )}
              >
                <TransitionChildWrapper position={props.position!}>
                  <Dialog.Panel
                    className={classNames(
                      "pointer-events-auto relative w-screen",
                      props.fullScreen === true
                        ? "max-w-full"
                        : props.halfScreen === true
                        ? "max-w-1/2 pl-10 sm:pl-16"
                        : "max-w-sm",
                    )}
                  >
                    <div
                      className={classNames(
                        "flex h-full flex-col border-l border-border shadow-xl",
                        props.fullScreen
                          ? "bg-background"
                          : "milkblur bg-background/80",
                      )}
                    >
                      {!props.noHeader && (
                        <div
                          onPointerDown={(e) => {
                            if (e.detail === 2) {
                              if (props.fullScreenAvailable) {
                                props.setFullScreen!(!props.fullScreen);
                              }
                            }
                          }}
                          className="milkblur sticky top-0 z-10 flex h-8 items-center border-b border-border bg-background/80 px-2"
                        >
                          <div className="flex w-full items-center justify-start gap-3">
                            <div className="flex items-center gap-1">
                              <span className="sr-only">Close panel</span>
                              <Button variant={"ghost"} size={"iconSm"}>
                                <X
                                  onClick={() => props.setOpen(false)}
                                  className="h-4 w-4 cursor-pointer text-contrast hover:opacity-80"
                                  aria-hidden="true"
                                />
                              </Button>

                              <ScreenControls
                                fullScreenAvailable={props.fullScreenAvailable}
                                setFullScreen={props.setFullScreen}
                                halfScreenAvailable={props.halfScreenAvailable}
                                setHalfScreen={props.setHalfScreen}
                                fullScreen={props.fullScreen}
                                halfScreen={props.halfScreen}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="relative flex-1 overflow-y-scroll">
                        {props.children}
                      </div>
                    </div>
                  </Dialog.Panel>
                </TransitionChildWrapper>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
