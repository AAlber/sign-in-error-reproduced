import { motion } from "framer-motion";
import classNames from "@/src/client-functions/client-utils";
import type { PositionalModalProps } from ".";
import AnimationWrapper from "./animation-wrapper";

export default function ModalWrapper(props: PositionalModalProps) {
  return (
    <div
      className={classNames(
        props.open ? "absolute flex " : "hidden",
        "pointer-events-none z-[1000] flex h-full w-full items-end",
        props.positionY === "top" && "items-start",
        props.positionY === "bottom" && "items-end",
        props.positionY === "center" && "items-center",
        props.positionX === "left" && "justify-start",
        props.positionX === "right" && "justify-end",
        props.positionX === "center" && "justify-center",
      )}
    >
      <AnimationWrapper {...props}>
        <motion.div
          className={classNames(
            "pointer-events-auto m-3 w-auto max-w-2xl rounded-lg border border-border bg-background",
          )}
          layout
        >
          {props.children}
        </motion.div>
      </AnimationWrapper>
    </div>
  );
}
