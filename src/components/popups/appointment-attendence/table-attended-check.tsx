import { getAppointmentType } from "@/src/client-functions/client-appointment";
import { Checkbox } from "../../reusable/shadcn-ui/checkbox";
import useAppointmentAttendenceModal from "./zustand";

export const TableAttendedCheck = ({ data }) => {
  const { appointment, dataToUpdate, setDataToUpdate, countedMembers } =
    useAppointmentAttendenceModal();

  return (
    <div className="flex h-5 items-center justify-end gap-2 font-normal text-muted-contrast">
      {`${countedMembers}/${data.length}`}
      <Checkbox
        className="mr-4 data-[state=checked]:border-emerald-300 data-[state=checked]:bg-emerald-100 dark:data-[state=checked]:border-emerald-600 dark:data-[state=checked]:bg-emerald-900"
        checked={data.length === dataToUpdate.length}
        onCheckedChange={() => {
          if (data.length === dataToUpdate.length) {
            setDataToUpdate([]);
          } else {
            setDataToUpdate(
              data.map((member) => ({
                ...member,
                attended: true,
                attendingType:
                  getAppointmentType(appointment) === "hybrid"
                    ? "in-person"
                    : "online",
              })),
            );
          }
        }}
        aria-label="Select all"
      />
    </div>
  );
};
