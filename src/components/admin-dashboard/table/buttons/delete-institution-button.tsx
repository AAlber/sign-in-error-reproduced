import { X } from "lucide-react";
import { memo, useMemo } from "react";
import { adminDashDeleteInstitutions } from "@/src/client-functions/client-admin-dashboard";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import { Button } from "../../../reusable/shadcn-ui/button";
import { isAdminDashTestInstitution } from "..";

export const DeleteInstitutionButton = memo(function DeleteInstitutionButton({
  subscription,
  institutionId,
}: {
  subscription?: FuxamStripeSubscription;
  institutionId: string;
}) {
  const showButton = useMemo(() => {
    return !subscription || isAdminDashTestInstitution(subscription);
  }, [subscription]);
  return (
    showButton && (
      <Button
        variant={"ghost"}
        onClick={() => {
          adminDashDeleteInstitutions(institutionId);
        }}
      >
        <X className="size-4" />
      </Button>
    )
  );
});
