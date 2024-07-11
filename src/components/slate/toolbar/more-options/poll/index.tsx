import { BarChartBigIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { DialogTrigger } from "@/src/components/reusable/shadcn-ui/dialog";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";

export default function MenuItemPoll() {
  const { t } = useTranslation("page");
  return (
    <DialogTrigger className="w-full text-muted-contrast hover:text-contrast">
      <DropdownMenuItem className="flex w-full cursor-pointer items-center gap-2">
        <BarChartBigIcon className="h-4 w-4" />
        <span className="text-contrast">{t("chat.poll.create_poll")}</span>
      </DropdownMenuItem>
    </DialogTrigger>
  );
}
