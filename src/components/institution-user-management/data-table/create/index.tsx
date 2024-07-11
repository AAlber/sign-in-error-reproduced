import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Dialog } from "@/src/components/reusable/shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import * as ColumnDialog from "./column";
import * as GroupDialog from "./group";
import * as UserDialog from "./user";

export default function Create() {
  const { t } = useTranslation("page");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className="space-x-2" variant={"cta"}>
            <span>{t("general.create")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-32 [&>div]:cursor-pointer"
          align="end"
        >
          <UserDialog.Trigger setOpen={setDialogOpen} />
          <GroupDialog.Trigger />
          <ColumnDialog.Trigger />
        </DropdownMenuContent>
      </DropdownMenu>
      <UserDialog.Content open={dialogOpen} setOpen={setDialogOpen} />
    </Dialog>
  );
}
