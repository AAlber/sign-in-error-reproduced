import { useTranslation } from "react-i18next";
import GiveAccessPopover from "@/src/components/reusable/give-access-popover";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import useCourseManagement from "../zustand";

export const AddEducators = ({ layerId }: { layerId: string }) => {
  const { t } = useTranslation("page");

  const { refresh, setRefresh } = useCourseManagement();

  return (
    <GiveAccessPopover
      data={{
        layerId: layerId,
        allowGroupImport: false,
        allowQuickInvite: false,
        availableRoles: ["educator"],
        onUserInvited: (e) => {
          console.log("User invited");

          setRefresh(refresh + 1);
        },
        onUserAdded: (e) => {
          console.log("User added");
          setRefresh(refresh + 1);
        },
      }}
    >
      <Button> {t("course_management.educators.add_educator")}</Button>
    </GiveAccessPopover>
  );
};
