import { useState } from "react";
import { useTranslation } from "react-i18next";
import { giveGroupAccessToLayer } from "@/src/client-functions/client-institution-user-groups";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import type { UserGroup } from "../../institution-settings/setting-containers/insti-settings-groups";
import useUserLayerManagement from "../../popups/layer-user-management/zustand";
import Spinner from "../../spinner";
import { BaseListItem, TextSection } from "./list-item";
import useGiveAccessPopover from "./zustand";
import TruncateHover from "../truncate-hover";

export default function GroupListItem({ group }: { group: UserGroup }) {
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);
  const { data } = useGiveAccessPopover();
  const { refreshUsers } = useUserLayerManagement();
  const { setOpen } = useGiveAccessPopover();

  const handleClick = async () => {
    if (!hasActiveSubscription()) return toastNoSubscription();
    setLoading(true);

    await giveGroupAccessToLayer(group.id, data.layerId);
    refreshUsers();
    setOpen(false);
    setLoading(false);
  };

  return (
    <BaseListItem className="px-4" onClick={handleClick}>
      {loading && (
        <div className="absolute right-2 my-3">
          <Spinner size="h-5 w-5" />
        </div>
      )}
      <TextSection
        title={TruncateHover({
          text: group.name,
          truncateAt: 50,
          side: "right",
        })}
        description={replaceVariablesInString(t("x-members"), [group.members])}
      />
    </BaseListItem>
  );
}
