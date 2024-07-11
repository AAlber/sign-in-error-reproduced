// ModalChangelog.js
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Spinner from "../../spinner";
import useChangelogStore from "../zustand";
import Footer from "./footer";
import ModalData from "./modal-data-component";

export default function ModalChangelog() {
  const { changelog, pagination, loading, idsToShow } = useChangelogStore();
  const { page, limit } = pagination;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedChangelog = changelog
    .filter((item) => idsToShow.includes(item.id))
    .slice(startIndex, endIndex);

  return (
    <div className="divide-standard relative flex flex-col justify-center gap-3 divide-y rounded-lg shadow-lg">
      {paginatedChangelog.map((item) => (
        <AnimatePresence key={pagination.page}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.isArray(idsToShow) && idsToShow.includes(item.id) ? (
              <>
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <ModalData key={item.id} {...item} />
                    <Footer />
                  </>
                )}
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
}
