import { useTranslation } from "react-i18next";
import WithToolTip from "@/src/components/reusable/with-tooltip";
import GroupInfo from "./info";
import GroupMemberSettings from "./members";
import Permissions from "./permissions";

export default function Settings() {
  const { t } = useTranslation("page");
  return (
    <div className="flex items-center space-x-1">
      <WithToolTip text={t("chat.group_settings.members.add_people")}>
        <GroupMemberSettings />
      </WithToolTip>
      <WithToolTip text={t("chat.group_settings_channel_information")}>
        <GroupInfo />
      </WithToolTip>
      <Permissions />
    </div>
  );
}
