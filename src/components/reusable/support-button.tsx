import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import { Button } from "./shadcn-ui/button";

type Props = {
  variant?: "cta" | "default";
};

export default function ContactSupportButton({ variant = "default" }: Props) {
  const { show } = useIntercom();
  const { t } = useTranslation("page");

  return (
    <Button variant={variant} onClick={() => show()}>
      {t("contact_support")}
    </Button>
  );
}
