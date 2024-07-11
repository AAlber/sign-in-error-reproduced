import { useTranslation } from "react-i18next";
import { toggleActiveSubscription } from "@/src/client-functions/client-stripe";
import useConfirmationModal from "@/src/components/popups/confirmation-modal/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useBilling } from "../../zustand-billing";
import { useUpgradeModal } from "../zustand";

export default function CancelSubscription() {
  const { subscription } = useBilling();
  const { initModal } = useConfirmationModal.getState();
  const { setUpgradeModalOpen } = useUpgradeModal();
  const isCancelled = subscription?.cancel_at_period_end;
  const { t } = useTranslation("page");

  return (
    <div className="mt-2 flex w-full flex-col items-start justify-start">
      <p className="w-full text-muted-contrast">{t("cancellation_subtitle")}</p>
      <Button
        variant={"destructive"}
        onClick={async () =>
          initModal({
            title: "billing_page.cancel_plan_modal.title",
            description: `billing_page.cancel_plan_modal.description`,
            actionName: "general.confirm",
            cancelName: "general.cancel",
            dangerousAction: true,
            requiredConfirmationCode: true,
            confirmationCode: t("billing_page.cancel_plan_cancel"),
            onConfirm: async () => {
              await toggleActiveSubscription(isCancelled);
              setUpgradeModalOpen(false);
            },
          })
        }
        className="mt-4 flex w-full gap-2 px-0 font-normal"
      >
        <span className="text-sm ">{t("billing_page.cancel_plan_cancel")}</span>
      </Button>
    </div>
  );
}
