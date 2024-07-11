import { useTranslation } from "react-i18next";
import CreateStripeAccountButton from "../../access-pass-buttons/create-stripe-account";

export default function RecipientAccountRequirement() {
  const { t } = useTranslation("page");
  return (
    <div className="flex justify-between text-sm ">
      <div>
        {t("access_pass.member_pays_pass")}
        <div className="text-xs text-muted-contrast">
          {t("recipient_account_required")}
        </div>
      </div>
      <CreateStripeAccountButton />
    </div>
  );
}
