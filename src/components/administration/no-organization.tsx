import { Plus, Rocket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { EmptyState } from "../reusable/empty-state";
import { Button } from "../reusable/shadcn-ui/button";

export default function NoOrganization() {
  const { t } = useTranslation("page");
  const onBoardingLinkDemo =
    process.env.NEXT_PUBLIC_SERVER_URL + "onboarding?trial=true";

  const onBoardingLink = process.env.NEXT_PUBLIC_SERVER_URL + "onboarding";

  return (
    <EmptyState
      title="on_organizations_welcome_title"
      description="no_organizations_description"
      icon={Rocket}
      size="xlarge"
      withBlurEffect
    >
      <div className="mt-3 flex flex-row gap-4">
        <Button
          variant={"cta"}
          onClick={() => window.open(onBoardingLink, "_blank")}
        >
          <Plus className="mr-1 size-4" />
          {t("create_organization")}
        </Button>
        <Button
          variant={"default"}
          onClick={() => window.open(onBoardingLinkDemo, "_blank")}
        >
          <Plus className="mr-1 size-4" />
          {t("get_demo")}
        </Button>
      </div>
    </EmptyState>
  );
}
