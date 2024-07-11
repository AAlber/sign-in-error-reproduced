import { memo } from "react";
import { Sheet, SheetContent } from "../../../reusable/shadcn-ui/sheet";
import { useAdminDash } from "../zustand";
import InstitutionOverviewCenter from "./institution-overview-center";
import InstitutionOverviewLeftSidebar from "./left-sidebar";

const InstitutionOverviewSheet = memo(function InstitutionOverviewSheet({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { openedAdminDashInstitution } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  console.log("institution", openedAdminDashInstitution);
  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
      {institution && (
        <SheetContent
          side={"bottom"}
          className="flex size-full gap-0 bg-foreground p-0"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <InstitutionOverviewLeftSidebar />
          <InstitutionOverviewCenter />
          {/* <UserOverviewContent />
          <UserNotesSidebar /> */}
        </SheetContent>
      )}
    </Sheet>
  );
});
export default InstitutionOverviewSheet;
