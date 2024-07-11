import { Star, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

type Props = {
  loading: boolean;
  onClick: () => void;
};

export const SetAsPrimaryEmailButton = ({ loading, onClick }: Props) => {
  const { t } = useTranslation("page");
  return (
    <Button
      disabled={loading}
      onClick={onClick}
      className="mr-2 text-primary/80"
    >
      <Star className="mr-2 h-4 w-4" />
      <span>{t("account_modal.email_overview_set_as_primary_button")}</span>
    </Button>
  );
};

export const GetVerificationCodeButton = ({ loading, onClick }: Props) => {
  const { t } = useTranslation("page");
  return (
    <Button disabled={loading} onClick={onClick} className="mr-2">
      <span>{t("account_modal.email_overview_verify_button")}</span>
    </Button>
  );
};

export const RemoveEmailButton = ({ loading, onClick }: Props) => {
  return (
    <Button disabled={loading} className="text-destructive">
      <Trash className="h-4 w-4" onClick={onClick} />
    </Button>
  );
};
