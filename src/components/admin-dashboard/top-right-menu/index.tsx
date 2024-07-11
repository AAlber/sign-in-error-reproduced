import { RefreshCcw } from "lucide-react";
import { memo } from "react";
import { Button } from "../../reusable/shadcn-ui/button";
import { useAdminDash } from "../table/zustand";
import CreateInstitutionPopover from "./create-institution-popover";
import CreatePaymentLink from "./create-payment-link";

export const AdminDashTopRightMenu = memo(function AdminDashTopRightMenu() {
  const { setRefresh, refresh } = useAdminDash();
  return (
    <div className="flex gap-2">
      <Button onClick={() => setRefresh(refresh + 1)}>
        <RefreshCcw className="size-4" />
      </Button>
      <CreatePaymentLink />
      <CreateInstitutionPopover />
    </div>
  );
});
