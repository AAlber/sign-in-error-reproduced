import { useTranslation } from "react-i18next";
import { Button } from "../shadcn-ui/button";
import { useSurveyDialog } from "./zustand";

export const StartSurveyButton = ({ text }: { text: string }) => {
  const { t } = useTranslation("page");
  const { carouselApi } = useSurveyDialog();

  return (
    <Button
      variant={"cta"}
      onClick={() => {
        carouselApi?.scrollNext();
      }}
    >
      {t(text)}
    </Button>
  );
};
