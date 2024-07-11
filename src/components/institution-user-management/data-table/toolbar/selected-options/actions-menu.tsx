import type { Table } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import Status from "./actions/change-status";
import { ActionMail } from "./actions/email";
import { ActionRemove } from "./actions/remove";

interface TableActionsMenuButtonProps<TData> {
  table: Table<TData>;
}

export function Options<TData>({ table }: TableActionsMenuButtonProps<TData>) {
  const { t } = useTranslation("page");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant={"ghost"} size={"icon"}>
            <MoreHorizontal className="h-5 w-5 text-contrast" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="!shadow-nonefocus:outline-none mr-5 w-[200px] opacity-100 "
      >
        <DropdownMenuGroup>
          <Status table={table} />
          <ActionMail table={table} />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <ActionRemove />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
