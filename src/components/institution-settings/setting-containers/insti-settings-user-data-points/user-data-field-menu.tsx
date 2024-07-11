import { MoreHorizontal, Share, Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  deleteInstitutionUserDataField,
  exportInstitutionUserDataFieldValuesAsCSV,
} from "@/src/client-functions/client-institution-user-data-field";
import { chooseAction } from "@/src/client-functions/client-options-modal";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import type { InstitutionUserDataFieldWithValueData } from "@/src/types/institution-user-data-field.types";
import { useInstitutionUserDataFieldsList } from "./zustand";

export default function UserDataFieldMenu({
  dataField,
}: {
  dataField: InstitutionUserDataFieldWithValueData;
}) {
  const { userDataFields, setUserDataFields } =
    useInstitutionUserDataFieldsList();
  const { t } = useTranslation("page");

  const invalidateUserManagementTable = () => {
    // updating values here will invalidate query keys within userManagement table
    useInstitutionUserManagement.setState((state) => ({
      refresh: state.refresh + 1,
      valueChanges: [],
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"iconSm"} variant={"ghost"}>
          <MoreHorizontal
            className="text-muted-contrast hover:opacity-70 "
            size={18}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="mr-5 w-[200px] opacity-100 !shadow-none focus:outline-none"
      >
        <DropdownMenuItem
          onClick={async () =>
            exportInstitutionUserDataFieldValuesAsCSV(dataField.id)
          }
        >
          <Share className="h-4 w-4" />
          {t("export")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            if (dataField.valueCount > 0) {
              chooseAction(
                {
                  mainAction: async () => {
                    await exportInstitutionUserDataFieldValuesAsCSV(
                      dataField.id,
                    );
                    setUserDataFields(
                      userDataFields.filter(
                        (field) => field.id !== dataField.id,
                      ),
                    );
                    const success = await deleteInstitutionUserDataField(
                      dataField.id,
                    );
                    if (!success) {
                      setUserDataFields([...userDataFields, dataField]);
                    }
                    invalidateUserManagementTable();
                  },
                  secondaryAction: async () => {
                    setUserDataFields(
                      userDataFields.filter(
                        (field) => field.id !== dataField.id,
                      ),
                    );
                    const success = await deleteInstitutionUserDataField(
                      dataField.id,
                    );
                    if (!success) {
                      setUserDataFields([...userDataFields, dataField]);
                    }
                    invalidateUserManagementTable();
                  },
                  secondaryActionName: t("just-delete"),
                  mainActionName: t("delete-and-export"),
                },
                {
                  title: replaceVariablesInString(t("delete-data-field"), [
                    String(dataField.valueCount),
                  ]),
                  description: t("delete-data-field.desc"),
                  dangerousAction: true,
                },
              );
            } else {
              setUserDataFields(
                userDataFields.filter((field) => field.id !== dataField.id),
              );
              const success = await deleteInstitutionUserDataField(
                dataField.id,
              );
              if (!success) {
                setUserDataFields([...userDataFields, dataField]);
              }
              invalidateUserManagementTable();
            }
          }}
          className="text-destructive"
        >
          <Trash className="h-4 w-4" />
          {t("general.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
