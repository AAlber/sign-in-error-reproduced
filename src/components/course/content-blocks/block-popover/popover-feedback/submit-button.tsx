import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export const SubmitButton = ({
  isDisabled,
  handleClick,
  isLoading,
}: {
  isDisabled: boolean;
  handleClick: () => Promise<void>;
  isLoading: boolean;
}) => {
  const { t } = useTranslation("page");

  return (
    <Button
      disabled={isDisabled}
      onClick={handleClick}
      className="w-full"
      variant="cta"
    >
      {isLoading
        ? t("general.loading")
        : t("course_main_content_feedbacks_submit_feedback")}
    </Button>
  );
};
