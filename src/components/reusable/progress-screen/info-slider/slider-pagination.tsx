import clsx from "clsx";
import { motion } from "framer-motion";
// import { log } from "@/src/utils/logger/logger";
import { useProgressScreenStore } from "../zustand";

export const SliderPagination = () => {
  const { currentScreen, count, setCurrentScreen, carouselApi } =
    useProgressScreenStore();

  const handlePaginationClick = (index: number) => {
    // log.info("User changes slides manually to", index);
    setCurrentScreen(index);
    carouselApi!.scrollTo(index);
  };

  return (
    <div className="absolute bottom-5 z-10 flex w-full items-center justify-center pr-10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "relative m-1 h-2 cursor-pointer rounded-full bg-white/60 transition-all duration-150 ease-in-out",
            currentScreen === i + 1 ? "w-8" : "w-2",
          )}
          onClick={() => handlePaginationClick(i)}
        >
          {currentScreen === i + 1 && (
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute left-0 top-0 h-full rounded-full bg-white/80"
            />
          )}
        </div>
      ))}
    </div>
  );
};
