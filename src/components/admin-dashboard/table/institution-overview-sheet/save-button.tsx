import { memo, useState } from "react";
import { updateInstitutionCredits } from "@/src/client-functions/client-admin-dashboard";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { useAdminDash } from "../zustand";
import type { CreditEditData } from "./edit-institution-credit";

const CreditSaveButton = memo(function CreditSaveButton({
  creditEditData,
  onSuccess,
}: {
  creditEditData: Partial<CreditEditData>;
  onSuccess?: (data: any) => void;
}) {
  const { openedAdminDashInstitution } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  return (
    institution && (
      <Button
        className="w-24"
        variant={"cta"}
        loading={isUpdating}
        disabled={isUpdating}
        onClick={async () => {
          setIsUpdating(true);
          await updateInstitutionCredits({
            ...creditEditData,
            institutionId: institution.id,
            onSuccess,
          });
          setIsUpdating(false);
        }}
      >
        Save
      </Button>
    )
  );
});
export default CreditSaveButton;
