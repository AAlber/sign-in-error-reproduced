import { useUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import FuxamBotLayout from "../reusable/fuxam-bot-layout";

export default function NoInstitution() {
  const { t } = useTranslation("page");
  const { user } = useUser();

  return (
    <div className="h-full w-full overflow-hidden rounded-md border border-border">
      <FuxamBotLayout state="neutral">
        <p className="bg-gradient-to-t text-xl font-semibold leading-8 text-primary">
          {t("hello")} {user?.firstName}!
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-contrast sm:text-4xl">
          {t("dashboard_no_organization")}
        </h1>
        <p className="text-base leading-8 text-muted-contrast">
          {t("dashboard_no_organization_subtitle")}
        </p>
      </FuxamBotLayout>
    </div>
  );
}
