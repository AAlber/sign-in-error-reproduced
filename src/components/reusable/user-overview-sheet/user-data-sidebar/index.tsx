import { X } from "lucide-react";
import { Button } from "../../shadcn-ui/button";
import { SheetClose } from "../../shadcn-ui/sheet";
import { useUserOverview } from "../zustand";
import { UserCustomDataList } from "./user-custom-data-list";
import { UserHeader } from "./user-header";

export const UserDataSideBar = () => {
  const { user } = useUserOverview();
  if (!user) return null;

  return (
    <div className="flex h-full w-full max-w-[300px] border-r border-border bg-background flex-col gap-4">
      <div className="flex h-14 items-cente p-4">
        <SheetClose>
          <Button variant={"ghost"} size={"icon"}>
            <X className="h-4 w-4" />
          </Button>
        </SheetClose>
      </div>
      <UserHeader user={user} />
      <UserCustomDataList user={user} />
    </div>
  );
};
