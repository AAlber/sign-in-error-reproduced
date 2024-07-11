import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import useChangelogStore from "../zustand";
import CloseButton from "./buttons/close-button";
import { ContinueButton } from "./buttons/continue-button";
import { PreviousButton } from "./buttons/previus-button";
import { SkipButton } from "./buttons/skip-button";

export default function Footer() {
  const { pagination } = useChangelogStore();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pagination.page}
        className="flex items-center justify-end px-4 py-3"
      >
        {pagination.total > 1 && !(pagination.total === pagination.page) && (
          <div className="absolute z-20 flex w-full justify-start pl-8">
            <SkipButton />
          </div>
        )}
        <motion.div
          className={`absolute -left-2 z-10 flex w-full items-center justify-center gap-2`}
          key={pagination.page}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {pagination.total > 1 &&
            Array.from({ length: pagination.total }).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2  rounded-full ${
                  i + 1 === pagination.page ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
        </motion.div>

        <div className="relative z-20 flex gap-2">
          <>
            <PreviousButton />
            {pagination.total !== pagination.page && <ContinueButton />}
            {pagination.total === pagination.page && <CloseButton />}
          </>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
