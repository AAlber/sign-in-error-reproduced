import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { MemberWithAttendence } from "@/src/client-functions/client-appointment-attendence";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import useUser from "@/src/zustand/user";
import { Checkbox } from "../../reusable/shadcn-ui/checkbox";
import {
  HoverCard,
  HoverCardSheet,
  HoverCardTrigger,
} from "../../reusable/shadcn-ui/hover-card";
import { handleChangeAttendingType, handleCheckboxChange } from "./functions";
import useAppointmentAttendenceModal from "./zustand";

type UserAttendenceMenuProps = {
  member: MemberWithAttendence;
  membersWithAttendance: MemberWithAttendence[];
};

export default function UserAttendenceCheck({
  member,
  membersWithAttendance,
}: UserAttendenceMenuProps) {
  const { appointment, setDataToUpdate, dataToUpdate } =
    useAppointmentAttendenceModal();
  const attendType =
    membersWithAttendance.find((m) => m.id === member.id)?.attendingType ||
    "in-person";
  const { user } = useUser();
  dayjs.locale(user.language);

  const { t } = useTranslation("page");

  return (
    <>
      {appointment.isHybrid && (
        <div className="mr-2">
          <Select
            defaultValue={
              dataToUpdate.some((m) => m.id === member.id)
                ? dataToUpdate.find((m) => m.id === member.id)!.attendingType
                : attendType
            }
            onValueChange={(v) =>
              handleChangeAttendingType(
                v as "in-person" | "online",
                member,
                membersWithAttendance,
                dataToUpdate,
                setDataToUpdate,
              )
            }
          >
            <SelectTrigger className="min-w-[140px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-person">In-person</SelectItem>
              <SelectItem value="online">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <HoverCard openDelay={250} closeDelay={50}>
        <HoverCardTrigger>
          <Checkbox
            variant={"positive"}
            checked={
              dataToUpdate.some((m) => m.id === member.id)
                ? dataToUpdate.find((m) => m.id === member.id)!.attended
                : member.attended
            }
            onCheckedChange={(newValue) =>
              handleCheckboxChange(
                newValue as boolean,
                member,
                membersWithAttendance,
                dataToUpdate,
                setDataToUpdate,
                attendType as "in-person" | "online",
              )
            }
          />
        </HoverCardTrigger>
        <HoverCardSheet side="left">
          {member.attended || dataToUpdate.some((m) => m.id === member.id)
            ? t("attendence.attended")
            : t("attendence.not_attended")}
        </HoverCardSheet>
      </HoverCard>
    </>
  );
}
