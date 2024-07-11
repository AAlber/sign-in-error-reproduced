import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  MailOpen,
  PuzzleIcon,
  Shield,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import GradingOverviewTable from "@/src/components/reusable/grading-overview-table";
import MultiPageModal from "@/src/components/reusable/multi-page-modal";
import UserAttendanceView from "@/src/components/reusable/user-overview/user-attendance-view";
import UserInvoicesTable from "@/src/components/reusable/user-overview/user-invoices";
import useUser from "@/src/zustand/user";
import AccountOverview from "./pages/account";
import EmailOverview from "./pages/email";
import { Integrations } from "./pages/integrations";
import SecurityOverview from "./pages/security";
import useAccountOverview from "./zustand";

export default function AccountModal() {
  const { setOpen, open } = useAccountOverview();
  const { t } = useTranslation("page");
  const { user } = useUser();

  if (!user) return null;

  return (
    <MultiPageModal
      open={open}
      setOpen={setOpen}
      title={"some title"}
      useTabsInsteadOfSteps={true}
      noButtons
      finishButtonText="close"
      onClose={() => setOpen(false)}
      onFinish={() => Promise.resolve()}
      height="md"
      pages={[
        {
          nextStepRequirement: () => false,
          title: t("user_menu.option2"),
          tabIcon: <User size={17} />,
          tabTitle: "user_menu.option2",
          description: "account_modal.account_overview_subtitle",
          children: <AccountOverview />,
        },
        {
          nextStepRequirement: () => false,
          title: t("organization_settings.administrators_invite_email"),
          tabIcon: <MailOpen size={17} />,
          tabTitle: "organization_settings.administrators_invite_email",
          description: "account_modal.email_overview_subtitle",
          children: <EmailOverview />,
        },
        {
          nextStepRequirement: () => false,
          title: t("account_modal.security_title"),
          tabIcon: <Shield size={17} />,
          tabTitle: "account_modal.security_title",
          description: "account_modal.security_subtitle",
          children: <SecurityOverview />,
        },
        {
          nextStepRequirement: () => false,
          title: t("attendance"),
          tabTitle: "attendance",
          tabIcon: <CalendarCheck size={17} />,
          description: "account_modal.attendances_subtitle",
          children: <UserAttendanceView />,
        },
        {
          nextStepRequirement: () => false,
          title: t("grades"),
          tabTitle: "grades",
          tabIcon: <BarChart3 size={17} />,
          description: "account_modal.grades_subtitle",
          children: <GradingOverviewTable />,
        },
        {
          nextStepRequirement: () => false,
          title: t("invoices"),
          tabTitle: "invoices",
          tabIcon: <CreditCard size={17} />,
          description: "account_modal.invoices_subtitle",
          children: <UserInvoicesTable user={user} />,
        },
        {
          nextStepRequirement: () => false,
          title: t("integrations"),
          tabTitle: "integrations",
          tabIcon: <PuzzleIcon size={17} />,
          description: "account_modal.integrations_subtitle",
          children: <Integrations />,
        },
      ]}
    />
  );
}
