import { prisma } from "../db/client";

export const getAppointmentInvitationEmailsOfUsers = async (
  userIds: string[],
) => {
  return await prisma.userAppointmentInvitationEmail.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });
};
