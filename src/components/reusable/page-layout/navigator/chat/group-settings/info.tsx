import dayjs from "dayjs";
import { InfoIcon, TrashIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import { capitalize } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { DropdownMenuSeparator } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import useUser from "@/src/zustand/user";
import { useChannelHeaderContext } from "../channel-header";

const GroupInfo = () => {
  const { user: data } = useUser();
  const { channel } = useChannelHeaderContext();
  const { t } = useTranslation("page");

  const owner = (channel.data?.created_by as { name: string })?.name;
  const createdAt = channel.data?.created_at as Date;
  const membership = channel.state.members;
  const channelMembership = membership[data.id];

  const capabilities = channel.data?.own_capabilities;

  const handleDeleteChannel = () => {
    confirmAction(
      async () => {
        if (!capabilities?.includes("delete-channel")) return;
        channel.delete().catch(console.log);
      },
      {
        title: t("chat.group_settings.delete.alert_title"),
        description: t("chat.group_settings.delete.alert_description"),
        dangerousAction: true,
        actionName: t("chat.channel.list.menu.delete_chat"),
      },
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        className="relative top-[1px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button variant={"ghost"}>
          {
            <InfoIcon className="h-4 w-4 text-contrast hover:text-accent-contrast" />
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4 p-2 text-sm">
        <p>{t("chat.channel.info.channel_information")}:</p>
        <InfoBox
          title={t("chat.channel.info.channel_name")}
          description={channel.data?.name}
        />
        <InfoBox
          title={t("chat.channel.info.created_by")}
          description={owner}
        />
        <InfoBox
          title={t("chat.channel.info.created_at")}
          description={dayjs(createdAt).fromNow()}
        />
        <InfoBox
          title={t("chat.channel.info.channel_role")}
          description={capitalize(channelMembership?.role ?? "")}
        />
        {process.env.NODE_ENV === "development" && (
          <>
            <InfoBox title="Channel Type" description={channel.type} />
            <InfoBox
              title={t("chat.channel.info.your_permissions")}
              description={channel.data?.own_capabilities?.join(", ")}
            />
          </>
        )}
        {capabilities?.includes("delete-channel") &&
          channel.type !== "course" && (
            <>
              <DropdownMenuSeparator />
              <button
                onClick={handleDeleteChannel}
                className="!m-0 !mt-2 flex items-center space-x-2 !p-0 text-destructive"
              >
                <TrashIcon size={16} />{" "}
                <span>{t("chat.channel.list.menu.delete_chat")}</span>
              </button>
            </>
          )}
      </PopoverContent>
    </Popover>
  );
};

export default GroupInfo;

const InfoBox = (props: { title: string; description: React.ReactNode }) => {
  const { description, title } = props;
  return (
    <div>
      <p className="text-muted-contrast">{title}</p>
      <p>{description}</p>
    </div>
  );
};
