import clsx from "clsx";
import { useSurveyDialog } from "../zustand";

export const PaginationDots = () => {
  const { currentPage, pageCount } = useSurveyDialog();

  return (
    <div className="absolute z-10 flex h-full w-full items-center justify-center">
      {Array.from({ length: pageCount }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            "mx-0.5 h-1.5 w-1.5 rounded-full bg-muted transition-all duration-200 ease-in-out",
            index === currentPage - 1 && "bg-primary",
          )}
        ></div>
      ))}
    </div>
  );
};
