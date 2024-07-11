import { Link } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../shadcn-ui/checkbox";
import { Input } from "../shadcn-ui/input";
import { Separator } from "../shadcn-ui/separator";
import QuickInvite from "./quick-invite";
import UsersToAddList from "./user-to-add-list";
import useGiveAccessPopover from "./zustand";

export default function UsersTab() {
  const { t } = useTranslation("page");

  const {
    data: zustandData,
    search,
    allowPublicShareLink,
    setSearch,
    setAllowPublicShareLink,
  } = useGiveAccessPopover();

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("general.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <UsersToAddList />
      {zustandData.allowQuickInvite && (
        <div className="-mx-4">
          <Separator />
          <div className="flex w-full items-center justify-between px-4 pt-3 text-sm">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-contrast" />
              <span className="text-sm text-muted-contrast">
                {t("public_share_link")}
              </span>
            </div>
            <Checkbox
              checked={allowPublicShareLink}
              onCheckedChange={() =>
                setAllowPublicShareLink(!allowPublicShareLink)
              }
            />
          </div>
        </div>
      )}
      {zustandData.allowQuickInvite && allowPublicShareLink && (
        <>
          <QuickInvite />
        </>
      )}
    </div>
  );
}
