import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const TransitionChildWrapper = (props: {
  position: string;
  children: React.ReactNode;
}) => {
  return (
    <Transition.Child
      as={Fragment}
      enter="transform transition ease-in-out duration-300"
      enterFrom={
        props.position === "bottom" ? "translate-y-full" : "translate-x-full"
      }
      enterTo={props.position === "bottom" ? "translate-y-0" : "translate-x-0"}
      leave="transform transition ease-in-out duration-300"
      leaveFrom={
        props.position === "bottom" ? "translate-y-0" : "translate-x-0"
      }
      leaveTo={
        props.position === "bottom" ? "translate-y-full" : "translate-x-full"
      }
    >
      {props.children}
    </Transition.Child>
  );
};

export default TransitionChildWrapper;
