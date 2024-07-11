import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setInstitutionUserDataFieldValues } from "@/src/client-functions/client-institution-user-data-field";
import classNames from "@/src/client-functions/client-utils";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import useUser from "@/src/zustand/user";
import { useInstitutionUserManagement } from "../../institution-user-management/zustand";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import { Label } from "../shadcn-ui/label";

export default function UserDataFieldList({
  user,
}: {
  user: InstitutionUserManagementUser;
}) {
  const { t } = useTranslation("page");
  const { user: data } = useUser();
  const { dataFields, users, setUsers, refreshList } =
    useInstitutionUserManagement();
  const [loading, setLoading] = useState(false);
  const [valueChanges, setValueChanges] = useState<
    {
      userId: string;
      fieldId: string;
      value: string;
    }[]
  >([]);

  const [haveChanges, setHaveChanges] = useState(false);

  async function handleSave() {
    setHaveChanges(false);
    setLoading(true);
    await setInstitutionUserDataFieldValues({
      values: valueChanges,
    });
    setUsers(
      users.map((u) => {
        if (u.id === user.id) {
          return {
            ...u,
            fieldData: [
              ...u.fieldData.filter(
                (d) => !valueChanges.find((v) => v.fieldId === d.fieldId),
              ),
              ...valueChanges.map((v) => {
                return {
                  fieldId: v.fieldId,
                  userId: v.userId,
                  value: v.value,
                  institutionId: data.currentInstitutionId,
                  id: "",
                };
              }),
            ],
          };
        }
        return u;
      }),
    );

    setLoading(false);
    refreshList();
  }

  useEffect(() => {
    setValueChanges(
      user.fieldData.map((d) => {
        return {
          fieldId: d.fieldId,
          userId: d.userId,
          value: d.value,
        };
      }),
    );
  }, [user]);

  return (
    <>
      {haveChanges && (
        <div className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-between border-t border-border bg-background p-4">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium text-contrast">
              {t("unsaved-changes")}
            </h2>
            <p className="text-sm text-muted-contrast">
              {t("unsaved-changes-description")}
            </p>
          </div>
          <Button onClick={handleSave} variant={"cta"}>
            {" "}
            {t(loading ? "general.loading" : "general.save")}
          </Button>
        </div>
      )}
      <div
        className={classNames(valueChanges.length > 0 && "mb-12", "grid gap-2")}
      >
        {dataFields.length === 0 && (
          <div className="mx-10 mt-5 flex flex-col items-center justify-center gap-1 text-center">
            <p className="font-medium text-contrast">
              {t("no_custom_data_fields")}
            </p>
            <p className="text-sm text-muted-contrast">
              {t("no_custom_data_fields_description")}
            </p>
          </div>
        )}
        {dataFields.map((df) => {
          const originalData = user.fieldData.find(
            (d) => d.fieldId === df.id && d.userId === user.id,
          );

          return (
            <div
              key={df.id}
              className="grid grid-cols-3 items-center justify-center gap-1"
            >
              <Label>{df.name}</Label>
              <Input
                className="col-span-2"
                value={
                  valueChanges.find(
                    (v) => v.userId === user.id && v.fieldId === df.id,
                  )?.value ||
                  (originalData && originalData.value) ||
                  ""
                }
                onChange={(e) => {
                  setValueChanges([
                    ...valueChanges.filter(
                      (v) => !(v.userId === user.id && v.fieldId === df.id),
                    ),
                    {
                      userId: user.id,
                      fieldId: df.id,
                      value: e.target.value,
                    },
                  ]);
                  setHaveChanges(true);
                }}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
