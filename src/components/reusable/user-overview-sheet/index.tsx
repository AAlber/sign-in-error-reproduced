import { Sheet, SheetContent } from "../shadcn-ui/sheet";
import { UserDataSideBar } from "./user-data-sidebar";
import { UserNotesSidebar } from "./user-notes-sidebar";
import { UserOverviewContent } from "./user-overview-content";
import { useUserOverview } from "./zustand";

const UserSheet = () => {
  const { open, setOpen } = useUserOverview();

  return (
    <Sheet open={open} onOpenChange={(open) => setOpen(open)} modal={false}>
      <SheetContent
        side={"bottom"}
        className="flex h-full w-full gap-0 bg-popover milkblur-mid p-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <UserDataSideBar />
        <UserOverviewContent />
        <UserNotesSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
