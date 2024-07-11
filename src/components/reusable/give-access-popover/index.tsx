import { User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "../shadcn-ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcn-ui/tabs";
import GroupsTab from "./group-list";
import UsersTab from "./user-list";
import type { GiveAccessPopoverData } from "./zustand";
import useGiveAccessPopover from "./zustand";

export default function GiveAccessPopover({
  data,
  children,
}: {
  data: GiveAccessPopoverData;
  children: React.ReactNode;
}) {
  const [tab, setTab] = useState<"users" | "groups">("users");
  const { t } = useTranslation("page");
  const [open, setOpen] = useState(false);

  const { data: zustandData, setData, setRole } = useGiveAccessPopover();

  useEffect(() => {
    if (!data) return;
    console.log("Setting data", data);
    setRole(data.availableRoles[0]!);
    setData(data);
    setTab("users");
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(!open)}>{children}</PopoverTrigger>
      <PopoverContent className="grid w-[390px] gap-4 py-3">
        {zustandData.allowGroupImport ? (
          <Tabs
            defaultValue={tab}
            value={tab}
            onValueChange={(value) => setTab(value as "users" | "groups")}
          >
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="users">
                <User className="mr-2 h-4 w-4" />
                {t("users")}
              </TabsTrigger>
              <TabsTrigger className="w-full" value="groups">
                <Users className="mr-2 h-4 w-4" />
                {t("groups")}
              </TabsTrigger>
            </TabsList>
            <TabsContent className="w-full" value="users">
              <UsersTab />
            </TabsContent>
            <TabsContent className="w-full" value="groups">
              <GroupsTab />
            </TabsContent>
          </Tabs>
        ) : (
          <UsersTab />
        )}
      </PopoverContent>
    </Popover>
  );
}
