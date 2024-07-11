import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import React, {
  Fragment,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import classNames from "../../../../../client-functions/client-utils";
import { Button } from "../../../shadcn-ui/button";
import useWhiteBoard from "./zustand";

interface Props extends PropsWithChildren {
  show: boolean;
  onSave: (filename?: string) => void;
  setIsMounted: (value: boolean) => void;
}
const TransitionComponent: React.FC<Props> = (props) => {
  const { isDirty, isSaving, name, close, setName } = useWhiteBoard();
  const { show, children, onSave, setIsMounted } = props;
  const [noNameError, setNoNameError] = useState(false);
  const { t } = useTranslation("page");

  useEffect(() => {
    if (noNameError === true) {
      setTimeout(() => {
        setNoNameError(false);
      }, 1000);
    }
  }, [noNameError]);

  const handleClose = () => {
    function unmount() {
      setIsMounted(false);
      setTimeout(() => {
        close();
      }, 300);
    }

    if (isDirty) {
      confirmAction(
        () => {
          unmount();
        },
        {
          title: "whiteboard.confirm_action_exit_title",
          description: "whiteboard.confirm_action_exit_description",
          actionName: "whiteboard.confirm_action_exit_action",
          dangerousAction: true,
        },
      );
      return;
    }

    unmount();
  };

  const handleSave = () => {
    if (!name) {
      setNoNameError(true);
      return;
    }
    onSave();
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          //
        }}
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
                  <div className="flex h-full flex-col overflow-y-scroll shadow-xl">
                    <div className="sticky top-0 z-10 flex h-12 w-screen items-center justify-between border-b border-border bg-background pl-4 pr-2 ">
                      <div className="flex w-full items-center justify-between">
                        <Dialog.Title className="flex items-center justify-between font-medium text-contrast">
                          <div className="flex items-center  gap-2">
                            <div className="flex h-7 items-center">
                              <span className="sr-only">Close panel</span>
                              <X
                                onClick={handleClose}
                                className="h-6 w-6 cursor-pointer  text-muted-contrast hover:text-contrast"
                                aria-hidden="true"
                              />
                            </div>
                            Whiteboard{" "}
                          </div>
                        </Dialog.Title>
                        <div className="flex items-center text-sm">
                          <input
                            type="text"
                            className={classNames(
                              noNameError && "placeholder-destructive",
                              "eborder-2 border-transparent  bg-transparent px-0 text-right text-sm text-contrast outline-none focus:border-transparent focus:ring-0 ",
                            )}
                            placeholder="Untitled"
                            value={name}
                            disabled={isSaving}
                            onChange={(e) => {
                              const title = e.target.value.replace(
                                /[^a-zA-Z0-9 ]/g,
                                "",
                              );
                              setName(title);
                            }}
                          />
                          <span className="text-muted-contrast">.scribble</span>
                        </div>
                        <Button
                          onClick={handleSave}
                          enabled={!isSaving && isDirty}
                          loading={isSaving}
                          variant={"cta"}
                        >
                          {t("general.save")}
                        </Button>
                      </div>
                    </div>
                    {children}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default TransitionComponent;
