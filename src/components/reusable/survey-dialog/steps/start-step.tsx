import { CarouselItem } from "../../shadcn-ui/carousel";
import { useKeydownHandler } from "../hooks";
import { useSurveyDialog } from "../zustand";

export const SurveyStartStep = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { carouselApi, currentPage } = useSurveyDialog();

  useKeydownHandler(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && carouselApi && currentPage === 0) {
        carouselApi.scrollNext();
      }
    },
    [carouselApi],
  );

  return <CarouselItem key={"intro"}>{children}</CarouselItem>;
};
