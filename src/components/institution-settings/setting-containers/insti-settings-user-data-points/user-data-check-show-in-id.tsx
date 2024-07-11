import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateInstitutionUserDataField } from "@/src/client-functions/client-institution-user-data-field";
import confirmAction from "@/src/client-functions/client-options-modal";
import { Checkbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import { useInstitutionUserDataFieldsList } from "./zustand";

export const UserDataShowInIDCheck = ({ row }) => {
  const { t } = useTranslation("page");
  const { setLoading } = useInstitutionUserDataFieldsList();
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <Checkbox
      checked={checked || row.original.showOnStudentIDCard}
      onCheckedChange={(e) => {
        if (e === true) {
          confirmAction(
            async () => {
              console.log("Collect from user");
              setLoading(true);
              await updateInstitutionUserDataField({
                id: row.original.id,
                showOnStudentIDCard: true,
              });
              setLoading(false);
              setChecked(true);
            },
            {
              title: t("user_data_points_table.show_in_user_id"),
              description: t(
                "user_data_points_table.show_in_user_id_description",
              ),
              actionName: t("general.confirm"),
              allowCancel: true,
              onCancel() {
                setChecked(false);
              },
            },
          );
        }
      }}
      onClick={async () => {
        if (checked || row.original.showOnStudentIDCard) {
          setLoading(true);
          await updateInstitutionUserDataField({
            id: row.original.id,
            showOnStudentIDCard: false,
          });
          setChecked(false);
          setLoading(false);
        } else {
          setChecked(true);
        }
      }}
    />
  );
};
