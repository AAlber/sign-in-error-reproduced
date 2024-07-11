import { Pen } from "lucide-react";
import { memo, useMemo } from "react";
import type { AdminDashSubscription } from "@/src/server/functions/server-stripe";
import { Button } from "../../../reusable/shadcn-ui/button";
import { isAdminDashTestInstitution } from "..";
import { useAdminDash } from "../zustand";

export const OpenEditModalButton = memo(function OpenEditModalButton({
  subscription,
  institutionId,
  children,
}: {
  subscription?: AdminDashSubscription;
  institutionId: string;
  children?: React.ReactNode;
}) {
  const { setOpenEditModal, setOpenedInstitutionId } = useAdminDash();
  const showButton = useMemo(() => {
    return isAdminDashTestInstitution(subscription) || !subscription;
  }, [subscription]);
  return showButton ? (
    <Button
      variant={"ghost"}
      onClick={() => {
        setOpenEditModal(true);
        setOpenedInstitutionId(institutionId);
      }}
    >
      {children}
      <Pen className="size-4" />
    </Button>
  ) : (
    <Button className="pointer-events-none opacity-0">
      <Pen className="size-4" />
    </Button>
  );
});
