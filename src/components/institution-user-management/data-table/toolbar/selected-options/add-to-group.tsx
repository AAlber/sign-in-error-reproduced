import { UsersIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetChatChannelById } from "@/src/client-functions/client-chat";
import {
  addUsersToInstitutionUserGroup,
  getUserGroupsOfInstitution,
} from "@/src/client-functions/client-institution-user-groups";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import AsyncSelect from "@/src/components/reusable/async-select";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import { useSelectMenuUserFilter } from "../../../select-menu/zustand";

export function AddToGroup() {
  const { getChannelById } = useGetChatChannelById();
  const { filteredUserIds, emptyFilter } = useSelectMenuUserFilter();
  const { t } = useTranslation("page");
  const [asyncSelectOpen, setAsyncSelectOpen] = useState(false);

  const handleAddUsersToGroupChat =
    (userIdsToAdd: string[]) => async (groupId: string) => {
      const channel = await getChannelById(groupId);
      if (channel)
        await channel.addMembers(userIdsToAdd.map((id) => ({ user_id: id })));
    };

  return (
    <WithToolTip
      text={t("add_to_group")}
      disabled={asyncSelectOpen}
      delay={300}
    >
      <AsyncSelect
        fetchData={() => getUserGroupsOfInstitution("")}
        onSelect={(group) => {
          addUsersToInstitutionUserGroup(
            filteredUserIds,
            group.id,
            handleAddUsersToGroupChat(filteredUserIds),
          );
          emptyFilter();
        }}
        open={asyncSelectOpen}
        setOpen={setAsyncSelectOpen}
        trigger={
          <Button
            onClick={() => {
              setAsyncSelectOpen(true);
            }}
            variant="ghost"
          >
            <UsersIcon className="h-4 w-4" />
          </Button>
        }
        openWithShortcut={false}
        noDataMessage="general.empty"
        side="bottom"
        placeholder="general.search"
        itemComponent={(group) => (
          <span>
            {group.name}
            <span className="ml-2 text-xs text-muted-contrast hover:border-accent">
              {replaceVariablesInString(t("x-members"), [group.members])}
            </span>
          </span>
        )}
        searchValue={(group) => group.name + " " + group.id}
      />
    </WithToolTip>
  );
}
