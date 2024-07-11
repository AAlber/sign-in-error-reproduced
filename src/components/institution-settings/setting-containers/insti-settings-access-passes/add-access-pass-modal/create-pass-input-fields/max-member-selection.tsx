import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import Box from "@/src/components/reusable/box";
import Tick from "@/src/components/reusable/settings-ticks/tick";
import MemberLimitInput from "./basic-access-pass-input/member-limit-input";

export default function MaxMemberSelection({
  withMemberLimit,
  setWithMemberLimit,
  setMaxUsers,
  maxUsers,
}: {
  withMemberLimit: boolean;
  setWithMemberLimit: (value: boolean) => void;
  setMaxUsers: (max?: number) => void;
  maxUsers?: number;
}) {
  const { t } = useTranslation("page");
  return (
    <div
      className={classNames(
        "mt-2",
        withMemberLimit ? "text-contrast" : "text-muted-contrast",
      )}
    >
      <Box smallPadding>
        <div className={"flex items-center justify-between"}>
          <p className="flex h-4 items-center gap-2 text-sm">
            <span>{t("manage_access_pass.add_member_limit")}</span>
          </p>
          <Tick
            checked={withMemberLimit}
            onChange={() => setWithMemberLimit(!withMemberLimit)}
          />
        </div>
        {withMemberLimit && (
          <MemberLimitInput setMaxUsers={setMaxUsers} maxUsers={maxUsers} />
        )}
      </Box>
    </div>
  );
}
