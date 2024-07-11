import { memo, useState } from "react";
import { adminDashDeleteInstitutions } from "@/src/client-functions/client-admin-dashboard";
import { Button } from "../../../reusable/shadcn-ui/button";
import { useAdminDash } from "../zustand";

export const DeleteMultipleButton = memo(function DeleteMultipleButton() {
  const { setSelectedInstitutionIds, selectedInstitutionIds } = useAdminDash();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Button
      disabled={isDeleting}
      variant={"destructive"}
      onClick={async () => {
        setIsDeleting(true);
        await adminDashDeleteInstitutions();
        setIsDeleting(false);
        setSelectedInstitutionIds([]);
      }}
    >
      Delete {selectedInstitutionIds.length} Institutions
    </Button>
  );
});
