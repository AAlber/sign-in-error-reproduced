import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import ChatContentDisplay from "./chat-content-display";
import useAutoLessonChat from "./zustand";

export default function AutoLessonChat() {
  const { open, block, reset } = useAutoLessonChat();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={reset}>
        <div className="fixed inset-0">
          <div className="milkblur-light flex min-h-full items-center justify-center bg-background/75 p-5 text-center  sm:items-center  dark:bg-opacity-75">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="pointer-events-auto relative flex h-[90vh] max-h-[900px] w-full max-w-7xl flex-col overflow-hidden rounded-lg border border-border bg-foreground/70 text-left  ">
                {block && <ChatContentDisplay />}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
