import { MoreVertical, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteAccessPass,
  getAndSetAccessPassStatusInfos,
} from "@/src/client-functions/client-access-pass";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import Spinner from "@/src/components/spinner";
import type { AccessPassStatusInfo } from "@/src/utils/stripe-types";

export default function DeleteDropdown({
  info,
}: {
  info: AccessPassStatusInfo;
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  return loading ? (
    <Spinner size="h-5 w-5" />
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical
          className="h-5 w-5 cursor-pointer self-end text-muted-contrast"
          aria-hidden="true"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mr-3 w-[165px] ">
        <DropdownMenuItem
          disabled={info.status !== null}
          onClick={async () => {
            setLoading(true);
            await deleteAccessPass({ accessPassId: info.accessPass.id });
            getAndSetAccessPassStatusInfos(setLoading);
          }}
          className="flex w-full px-2 text-sm text-destructive !shadow-none focus:outline-none"
        >
          <Trash className={"mr-3 w-4"} />
          <span>{t("general.delete")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
