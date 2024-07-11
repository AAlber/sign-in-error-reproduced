import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { log } from "@/src/utils/logger/logger";
import { Button } from "../../shadcn-ui/button";
import { useSurveyDialog } from "../zustand";

export const SurveyDialogNavigationButtons = () => {
  const { carouselApi, setPageCount, setCurrentPage } = useSurveyDialog();

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    setPageCount(carouselApi.scrollSnapList().length);
    setCurrentPage(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrentPage(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  return (
    <div className="relative z-20 flex items-center justify-center">
      <Button
        variant={"ghost"}
        onClick={() => {
          log.info("Going back in survey dialog");
          carouselApi?.scrollPrev();
        }}
        size={"iconSm"}
      >
        <ChevronLeft className="h-5 w-5 text-muted-contrast" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          log.info("Going forward in survey dialog");
          carouselApi?.scrollNext();
        }}
        size={"iconSm"}
      >
        <ChevronRight className="h-5 w-5 text-muted-contrast" />
      </Button>
    </div>
  );
};
