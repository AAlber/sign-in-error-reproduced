import { useEffect } from "react";
import useDashboard from "@/src/components/dashboard/zustand";

type ShowCourseInStructureProps = {
  layerId: string;
  outerWrapperRef: React.RefObject<HTMLDivElement>;
  onActive: (value: React.SetStateAction<boolean>) => void;
};

export const useShowCourseInStructure = ({
  layerId,
  outerWrapperRef,
  onActive,
}: ShowCourseInStructureProps) => {
  const { highlightedLayerId, setHighlightedLayerId } = useDashboard();

  useEffect(() => {
    if (highlightedLayerId === layerId && outerWrapperRef.current) {
      onActive(true);
      setHighlightedLayerId("");
      outerWrapperRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [highlightedLayerId, layerId, setHighlightedLayerId]);
};
