import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getUserGroupsOfInstitution } from "@/src/client-functions/client-institution-user-groups";
import {
  importAction,
  parseSpreadSheetFile,
} from "@/src/client-functions/client-user-management/import-user";
import type { UserGroup } from "@/src/components/institution-settings/setting-containers/insti-settings-groups";
import Modal from "@/src/components/reusable/modal";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import SimpleFileUpload from "@/src/components/reusable/simple-file-upload";
import Spinner from "@/src/components/spinner";
import { supportedSpreadSheetFileTypes } from "@/src/utils/utils";
import { useInstitutionUserManagement } from "../../../zustand";
import { createColumns } from "./column-def";
import type { ImportUserFieldsType } from "./schema";
import Table from "./table";
import useImportUser from "./zustand";

export default function ImportUser() {
  const { open, setOpen } = useImportUser();
  const [isLoading, setIsLoading] = useState(false);
  const [newCustomFields, setNewCustomFields] = useState<string[]>([]);
  const [newUsers, setNewUsers] = useState<ImportUserFieldsType>([]);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [groupsToCreate, setGroupsToCreate] = useState<string[]>([]);
  const { t } = useTranslation("page");

  const [userDataFields, refreshList] = useInstitutionUserManagement(
    (state) => [state.dataFields, state.refreshList],
  );

  useQuery({
    queryKey: [getUserGroupsOfInstitution.name],
    queryFn: () => getUserGroupsOfInstitution(undefined, false),
    enabled: open,
    staleTime: 30000,
    onSuccess: setUserGroups,
  });

  // extract just the unique customFields so we can build the table columns
  const customFields: string[] = useMemo(() => {
    const customFields = newUsers.flatMap(
      ({ email: _email, name: _name, ...rest }) => Object.keys(rest),
    );
    return Array.from(new Set(customFields));
  }, [newUsers]);

  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setNewCustomFields([]);
    setNewUsers([]);
    setIsLoading(false);
    if (inputRef.current?.value) {
      inputRef.current.value = "";
    }
  };

  const toggleModal = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // slight delay as we want modal to be closed before resetting component for a smooth exit
      setTimeout(() => {
        reset();
      }, 1000);
    }
  };

  const parseFile = (files: FileList) => {
    return parseSpreadSheetFile({
      files,
      userDataFields,
      userGroups,
      setNewCustomFields,
      setNewUsers,
      setGroupsToCreate,
      translateFunc: t,
    });
  };

  const handleClick = () => {
    return importAction({
      fields: userDataFields,
      isLoading,
      existingGroups: userGroups,
      groupsToCreate,
      newCustomFields,
      newUsers,
      refreshList,
      setIsLoading,
      toggleModal,
      translateFunc: t,
    });
  };

  return (
    <Modal open={open} setOpen={toggleModal} size="lg" className="!p-0">
      <CardHeader>
        <CardTitle>{t("user_management.import_user.modal.title")}</CardTitle>
        <CardDescription>
          {t("user_management.import_user.modal.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SimpleFileUpload
          onFileAdded={parseFile}
          onReset={reset}
          className="min-h-[200px]"
          accept={supportedSpreadSheetFileTypes.join(", ")}
          ref={inputRef}
        />
        {isLoading ? (
          <div className="flex justify-end">
            <Spinner size="h-8 w-8" />
          </div>
        ) : !!newUsers.length ? (
          <Table columns={createColumns(customFields)} data={newUsers} />
        ) : null}
        <div className="text-right">
          <Button
            onClick={handleClick}
            variant="cta"
            disabled={!newUsers.length || isLoading}
          >
            {t("general.import")}
          </Button>
        </div>
      </CardContent>
    </Modal>
  );
}
