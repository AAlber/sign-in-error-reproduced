import { AnimatePresence, motion } from "framer-motion";
import type { PositionalModalProps } from ".";

export default function AnimationWrapper(props: PositionalModalProps) {
  return (
    <AnimatePresence initial={false}>
      {props.open && (
        <motion.div
          className="transition-opacity duration-300 ease-in-out"
          key={"modal"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
