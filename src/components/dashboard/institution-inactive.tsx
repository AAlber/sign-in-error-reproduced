import { useTranslation } from "react-i18next";
import FuxamBotLayout from "../reusable/fuxam-bot-layout";

export default function UserInInstitutionInactive() {
  const { t } = useTranslation("page");

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-border">
      <FuxamBotLayout state="neutral">
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          {t("dashboard_user_inactive_in_org")}
        </h1>
        <p className="text-base leading-8 text-muted-contrast">
          {t("dashboard_user_inactive_in_org_desc")}
        </p>
      </FuxamBotLayout>
    </div>
  );
}
