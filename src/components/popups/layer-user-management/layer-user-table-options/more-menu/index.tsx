import { MoreHorizontal, Table } from "lucide-react";
import { useTranslation } from "react-i18next";
import { exportSimpleUserCSV } from "@/src/client-functions/client-user-management";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useUserLayerManagement from "../../zustand";

export default function MoreMenu() {
  const { t } = useTranslation("page");
  const { users, title } = useUserLayerManagement();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size={"icon"} variant={"ghost"}>
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() =>
            exportSimpleUserCSV({
              name: title,
              users: users.filter((user) => user.accessLevel === "access"),
            })
          }
        >
          <Table className="h-5 w-5" />
          {t("export_csv")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
