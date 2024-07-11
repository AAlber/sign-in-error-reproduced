import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import useOpenChatWithUser from "@/src/components/reusable/page-layout/navigator/chat/hooks/useOpenChatWithUser";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useUser from "@/src/zustand/user";
import UserDefaultImage from "../../../user-default-image";
import useUserDropdownView from "../zustand";

export default function UserListItem({ user, layerId }) {
  const { user: data } = useUser();
  const { userProfilesActive, showChatOption, onUserSelect } =
    useUserDropdownView();
  const { openChatWithUser } = useOpenChatWithUser();
  const { t } = useTranslation("page");
  return (
    <div
      key={user.id}
      className={classNames(
        "flex w-full items-center justify-between border-b border-border px-4 py-3 ",
        userProfilesActive && "cursor-pointer hover:bg-foreground",
      )}
    >
      <div
        onClick={async () => {
          if (onUserSelect) return onUserSelect(user);
        }}
        className="flex flex-1 items-center"
      >
        <UserDefaultImage user={user} dimensions={"h-8 w-8"} />
        <div className="ml-4">
          <div className="flex items-center gap-2 text-sm text-contrast">
            {user.name}{" "}
            {user.role === "educator" && (
              <span className="text-xs text-primary">Educator</span>
            )}
          </div>
          <div className="text-xs text-muted-contrast">{user.email}</div>
        </div>
      </div>
      {showChatOption && data.id !== user.id && (
        <Button onClick={() => openChatWithUser(user.id, user.name)}>
          {t("course_members_display_members_user_chat_button")}
        </Button>
      )}
    </div>
  );
}
