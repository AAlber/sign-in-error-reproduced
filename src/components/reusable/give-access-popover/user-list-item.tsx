import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import { createRole } from "@/src/client-functions/client-user-management";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { UserWithActiveStatus } from "@/src/types/user-management.types";
import Spinner from "../../spinner";
import UserDefaultImage from "../../user-default-image";
import WithToolTip from "../with-tooltip";
import { BaseListItem, ImageHolder, TextSection } from "./list-item";
import useGiveAccessPopover from "./zustand";

export default function UserListItem({ user }: { user: UserWithActiveStatus }) {
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);
  const { data, role, setOpen } = useGiveAccessPopover();

  const handleClick = async () => {
    if (!hasActiveSubscription()) return toastNoSubscription();
    setLoading(true);
    const success = await createRole({
      userId: user.id,
      layerId: data.layerId,
      role: role,
    });
    setLoading(false);
    setOpen(false);
    if (!success) return;
    data.onUserAdded(user, role);
    toast.success("toast_user_management_success3", {});
  };

  return (
    <BaseListItem onClick={handleClick}>
      {loading && (
        <div className="absolute right-2 my-3">
          <Spinner size="h-5 w-5" />
        </div>
      )}
      <ImageHolder>
        <UserDefaultImage user={user} dimensions={"h-7 w-7"} />
      </ImageHolder>
      <TextSection title={user.name} description={user.email} />
      {!user.active && (
        <WithToolTip text={"inactive_description"}>
          <span className="mr-2 text-xs text-muted-contrast">
            {t("inactive")}
          </span>
        </WithToolTip>
      )}
    </BaseListItem>
  );
}
