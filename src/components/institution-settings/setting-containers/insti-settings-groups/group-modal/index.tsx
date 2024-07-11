import { useTranslation } from "react-i18next";
import { useGetChatChannelById } from "@/src/client-functions/client-chat";
import {
  createInstitutionUserGroup,
  createInstitutionUserGroupAndAddUsers,
  updateInstitutionUserGroup,
} from "@/src/client-functions/client-institution-user-groups";
import Modal from "@/src/components/reusable/multi-page-modal";
import useUser from "@/src/zustand/user";
import GroupInput from "./input";
import { useUserGroupModal } from "./zustand";

export default function GroupModal() {
  const { user: data } = useUser();
  const {
    editMode,
    groupId,
    open,
    name,
    additionalInformation,
    color,
    setOpen,
    reset,
    userIdsToAddUponCreation,
  } = useUserGroupModal();

  const { getChannelById } = useGetChatChannelById();

  const handleEditGroupNameOnGetstream = async () => {
    const groupChannel = await getChannelById(groupId);
    if (groupChannel) {
      groupChannel.updatePartial({ set: { name } }).then(console.log);
    }
  };
  const { t } = useTranslation("page");

  const handleAddUsersToGroupChat = async (groupId: string) => {
    const channel = await getChannelById(groupId);
    if (channel)
      await channel.addMembers(
        userIdsToAddUponCreation.map((id) => ({ user_id: id })),
      );
  };

  return (
    <Modal
      maxWidth="max-w-[500px]"
      open={open}
      setOpen={setOpen}
      title={
        editMode
          ? t("organization_settings.user_management_group_modal_edit_title")
          : t("organization_settings.user_management_group_modal_create_title")
      }
      finishButtonText={
        editMode
          ? t("general.save")
          : t("organization_settings.user_management_group_modal_button_create")
      }
      onFinish={async () => {
        if (editMode) {
          updateInstitutionUserGroup({
            id: groupId,
            name,
            color,
            additionalInformation,
          });
          handleEditGroupNameOnGetstream();
        } else if (userIdsToAddUponCreation.length > 0)
          createInstitutionUserGroupAndAddUsers(
            {
              name,
              color,
              institutionId: data.currentInstitutionId,
              userIds: userIdsToAddUponCreation,
            },
            handleAddUsersToGroupChat,
          );
        else
          createInstitutionUserGroup({
            name,
            color,
            institutionId: data.currentInstitutionId,
            additionalInformation,
          });
        reset();
      }}
      onClose={reset}
      pages={[
        {
          nextStepRequirement: () => name.trim().length > 0,
          title: editMode
            ? t("organization_settings.user_management_group_modal_edit_title")
            : t(
                "organization_settings.user_management_group_modal_create_title",
              ),
          description: t(
            "organization_settings.user_management_group_modal_description",
          ),
          children: <GroupInput />,
        },
      ]}
    />
  );
}
