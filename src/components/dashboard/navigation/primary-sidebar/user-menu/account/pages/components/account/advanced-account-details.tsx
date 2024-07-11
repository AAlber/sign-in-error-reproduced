import { useUser as useClerkUser } from "@clerk/nextjs";
import { useTranslation } from "react-i18next";
import AdvancedOptionReveal from "@/src/components/reusable/advanced-options-reveal";
import useUser from "@/src/zustand/user";

const AdvancedAccountDetails = () => {
  const { t } = useTranslation("page");
  const { user: clerkUser } = useClerkUser();
  const { user } = useUser();

  return (
    <AdvancedOptionReveal alternateText="account_modal.advaned_account_details">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-muted-contrast">
          {t("account_modal.user_id_label")}: {clerkUser?.id}
        </span>
        <span className="text-sm text-muted-contrast">
          {t("account_modal.organization_id_label")}: {user.institution?.id}
        </span>
      </div>
    </AdvancedOptionReveal>
  );
};

export default AdvancedAccountDetails;
