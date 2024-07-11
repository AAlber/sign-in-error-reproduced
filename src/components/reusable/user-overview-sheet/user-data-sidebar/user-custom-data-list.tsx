import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import type { UserManagementDataFields } from "@/src/components/institution-user-management/data-table/user-custom-field/types";
import { useInstitutionUserManagement } from "@/src/components/institution-user-management/zustand";
import Skeleton from "@/src/components/skeleton";
import type { InstitutionUserManagementUser } from "@/src/types/user-management.types";
import { useUserOverview } from "../zustand";
import { UserCustomDataInput } from "./user-custom-data-input";
import { UserNoCustomData } from "./user-custom-data-no-data";

type Props = {
  user: InstitutionUserManagementUser;
};

export function UserCustomDataList({ user }: Props) {
  const { t } = useTranslation("page");
  const { dataFields } = useInstitutionUserManagement();
  const { customDataLoading } = useUserOverview();
  const { getValues } = useFormContext<UserManagementDataFields>();

  return (
    <>
      {customDataLoading ? (
        <div className="h-full w-full rounded">
          <Skeleton />
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col gap-4 overflow-y-scroll p-6">
          <UserNoCustomData />
          {dataFields.map((df) => {
            const originalData = user.fieldData.find(
              (d) => d.fieldId === df.id && d.userId === user.id,
            );

            const updatedValue = getValues(`${df.id}__${user.id}`);
            const customValues =
              updatedValue ?? (originalData && originalData.value);

            return (
              <div
                key={df.id}
                className="flex flex-col items-start justify-center gap-1"
              >
                <h4 className="text-sm text-muted-contrast">{df.name}</h4>
                <UserCustomDataInput fieldId={df.id} user={user}>
                  <p
                    className={classNames(
                      customValues && customValues.length > 0
                        ? "text-contrast"
                        : "text-muted",
                    )}
                  >
                    {customValues || t("no-custom-data")}
                  </p>
                </UserCustomDataInput>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
