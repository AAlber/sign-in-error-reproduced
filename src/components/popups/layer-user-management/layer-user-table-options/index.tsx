import { useTranslation } from "react-i18next";
import GiveAccessPopover from "@/src/components/reusable/give-access-popover";
import useGiveAccessPopover from "@/src/components/reusable/give-access-popover/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "@/src/components/reusable/shadcn-ui/hover-card";
import GiveAccessToLayersTip from "@/src/components/reusable/tips/give-access-to-layer";
import useUserLayerManagement from "../zustand";
import { LayerUserManagementFilter } from "./filter";

export default function LayerUserTableOptions() {
  const { layerId, title, users, setUsers, refreshUsers } =
    useUserLayerManagement();
  const { t } = useTranslation("page");
  const { open } = useGiveAccessPopover();

  return (
    <div className="ml-2 flex w-full items-center justify-between gap-2">
      <LayerUserManagementFilter />
      <div className="flex items-center gap-2">
        <HoverCard openDelay={300}>
          <HoverCardTrigger>
            <GiveAccessPopover
              data={{
                layerId,
                allowGroupImport: true,
                onUserInvited: () => {
                  refreshUsers();
                },
                onUserAdded: (user, role) => {
                  setUsers([
                    ...users,
                    {
                      ...user,
                      role,
                      invite: null,
                      accessLevel: "access",
                      accessState: "active",
                    },
                  ]);
                },
                allowQuickInvite: true,
                availableRoles: ["member", "educator", "moderator"],
              }}
            >
              <Button variant={"cta"}>{t("add_users")}</Button>
            </GiveAccessPopover>
          </HoverCardTrigger>
          {!open && (
            <HoverCardSheet className="mt-3 bg-background p-3">
              <GiveAccessToLayersTip layerName={title} />
            </HoverCardSheet>
          )}
        </HoverCard>
      </div>
    </div>
  );
}
