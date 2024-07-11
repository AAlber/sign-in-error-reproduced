import type { MemberWithAttendence } from "@/src/client-functions/client-appointment-attendence";
import {
  updateAttendenceOfUser,
  updateAttendenceOfUsers,
  updateAttendenceOfUsersWithFullData,
} from "@/src/client-functions/client-appointment-attendence";
import type { AppointmentEventType } from "@/src/types/appointment.types";
import { log } from "@/src/utils/logger/logger";

export const handleMemberAttendenceChange = (
  updatedMember: MemberWithAttendence,
  appointmentId: string,
  data: MemberWithAttendence[],
  setData: (data: MemberWithAttendence[]) => void,
  appointmentType: AppointmentEventType,
) => {
  const index = data.findIndex((member) => member.id === updatedMember.id);

  if (index !== -1) {
    const updatedData = [...data];
    updatedData[index] = updatedMember;

    const attendingType =
      appointmentType === "hybrid"
        ? updatedMember.attendingType || "in-person"
        : appointmentType;

    setData(updatedData);
    updateAttendenceOfUser(
      appointmentId,
      updatedMember.id,
      updatedMember.attended,
      attendingType,
    );
  }
};

export const handleAllMemberAttendenceChange = async (
  attended: boolean,
  appointmentId: string,
  data: MemberWithAttendence[],
  setData: (data: MemberWithAttendence[]) => void,
  appointmentType: AppointmentEventType,
) => {
  const updatedData = data.map((member) => {
    return {
      ...member,
      attended,
    };
  });

  const attendingTypes =
    appointmentType === "hybrid"
      ? updatedData.map((m) => m.attendingType)
      : updatedData.map(() => appointmentType);

  await updateAttendenceOfUsers(
    appointmentId,
    updatedData.map((member) => member.id),
    attended,
    attendingTypes,
  );
  setData(updatedData);
};

export const handleMembersAttendenceChange = async (
  appointmentId: string,
  data: MemberWithAttendence[],
  setData: (data: MemberWithAttendence[]) => void,
  fullData: MemberWithAttendence[],
) => {
  log.info("Updating attendence of users button clicked");
  await updateAttendenceOfUsersWithFullData(appointmentId, data);
  setData(data);
};

export const handleChangeAttendingType = (
  v: string,
  member: MemberWithAttendence,
  membersWithAttendance: MemberWithAttendence[],
  dataToUpdate: MemberWithAttendence[],
  setDataToUpdate: (data: MemberWithAttendence[]) => void,
) => {
  const oldMember = membersWithAttendance.find((m) => m.id === member.id);
  const updatedMember: MemberWithAttendence = {
    ...member,
    attendingType: v as "in-person" | "online",
    attended:
      dataToUpdate.find((m) => m.id === member.id)?.attended ?? member.attended,
  };

  if (updatedMember.attendingType === oldMember!.attendingType) {
    setDataToUpdate(dataToUpdate.filter((m) => m.id !== member.id));
  } else if (!dataToUpdate.some((m) => m.id === member.id)) {
    setDataToUpdate([...dataToUpdate, updatedMember]);
  } else {
    setDataToUpdate(
      dataToUpdate.map((m) => (m.id === member.id ? updatedMember : m)),
    );
  }
};

export const handleCheckboxChange = (
  newValue: boolean,
  member: MemberWithAttendence,
  membersWithAttendance: MemberWithAttendence[],
  dataToUpdate: MemberWithAttendence[],
  setDataToUpdate: (data: MemberWithAttendence[]) => void,
  attendType: "in-person" | "online",
) => {
  const oldMember = membersWithAttendance.find((m) => m.id === member.id);
  const updatedMember: MemberWithAttendence = {
    ...member,
    attended: newValue,
    attendingType:
      dataToUpdate.find((m) => m.id === member.id)?.attendingType ?? attendType,
  };

  if (updatedMember.attended === oldMember!.attended) {
    setDataToUpdate(dataToUpdate.filter((m) => m.id !== member.id));
  } else if (!dataToUpdate.some((m) => m.id === member.id)) {
    setDataToUpdate([...dataToUpdate, updatedMember]);
  } else {
    setDataToUpdate(
      dataToUpdate.map((m) => (m.id === member.id ? updatedMember : m)),
    );
  }
};

export const countAttendedMembers = (
  data: MemberWithAttendence[],
  dataToUpdate: MemberWithAttendence[],
) => {
  const attendedMap = new Map();

  dataToUpdate.forEach((memberToUpdate) => {
    attendedMap.set(memberToUpdate.id, memberToUpdate.attended);
  });

  data.forEach((member) => {
    if (!attendedMap.has(member.id)) {
      attendedMap.set(member.id, member.attended);
    }
  });

  let attendedCount = 0;
  attendedMap.forEach((attended) => {
    if (attended) {
      attendedCount += 1;
    }
  });

  return attendedCount;
};
