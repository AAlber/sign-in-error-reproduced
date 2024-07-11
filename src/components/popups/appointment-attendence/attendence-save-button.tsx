import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../reusable/shadcn-ui/button";
import { handleMembersAttendenceChange } from "./functions";
import useAppointmentAttendenceModal from "./zustand";

export const AttendenceSaveButton = ({ data, setData }) => {
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);

  const { appointment, dataToUpdate, refresh, setRefresh, setDataToUpdate } =
    useAppointmentAttendenceModal();

  return (
    <Button
      onClick={async () => {
        setLoading(true);
        await handleMembersAttendenceChange(
          appointment.id,
          dataToUpdate,
          setData,
          data,
        );
        setLoading(false);
        setRefresh(refresh + 1);
        setDataToUpdate([]);
      }}
      disabled={loading}
      variant={"cta"}
    >
      {t(loading ? "general.loading" : "general.save")}
    </Button>
  );
};
