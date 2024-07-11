import { X } from "lucide-react";
import { memo } from "react";
import { deleteInstitutionCoupon } from "@/src/client-functions/client-admin-dashboard";
import confirmAction from "@/src/client-functions/client-options-modal";
import { Button } from "../../../reusable/shadcn-ui/button";
import { useAdminDash } from "../zustand";

export const DeleteCouponButton = memo(function DeleteCouponButton({
  institutionId,
  type,
}: {
  institutionId: string;
  type: "main-subscription" | "access-pass";
}) {
  const { adminDashInstitutions, setAdminDashInstitutions } = useAdminDash();

  return (
    <Button
      variant={"ghost"}
      onClick={async () => {
        confirmAction(
          async () => {
            await deleteInstitutionCoupon({
              institutionId,
              type,
            });
            const copy = [...adminDashInstitutions];
            const index = copy.findIndex(
              (i) => i.institution.id === institutionId,
            );
            const current = copy[index];
            if (current) {
              if (type === "main-subscription") {
                current.institution.stripeAccount.mainSubscriptionCouponId =
                  null;
              } else {
                current.institution.stripeAccount.accessPassCouponId =
                  undefined;
                current.credits.accessPassCouponId = undefined;
              }
            }
            setAdminDashInstitutions(copy);
          },
          {
            title: "Delete Coupon",
            description:
              "Are you sure you want to delete this " +
              (type === "main-subscription"
                ? "Main Subscription"
                : "Access Pass") +
              " coupon?",
            actionName: "Delete",
          },
        );
      }}
    >
      <X className="size-4" />
    </Button>
  );
});
