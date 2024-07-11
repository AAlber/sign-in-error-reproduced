import type { Invite } from "@prisma/client";
import type { NextApiRequest } from "next";
import Email from "@/src/components/reusable/email";
import type {
  InviteError,
  InviteType,
  InviteWithLayerAndAccessPassAndInstitution,
  ServerCreate24hInvite,
  ServerCreateEmailInstitutionInvites,
  ServerCreateEmailLayerInvite,
  ServerCreateSingleEmailInvite,
  ServerCreateSingleInvite,
  UpdateCurrentInstitutionData,
} from "@/src/types/invite.types";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { log } from "@/src/utils/logger/logger";
import { env } from "../../env/server.mjs";
import { prisma } from "../db/client";
import { sentry } from "../singletons/sentry";
import { createUsageLogs } from "./server-access-passes";
import { checkHasExceededMaxUsersOfAccessPass } from "./server-access-passes/db-requests";
import emailService from "./server-email";
import { getSettingValues } from "./server-institution-settings";
import { createUserCheckoutSession } from "./server-paid-access-passes";
import {
  deleteValidatorToken,
  getValidatedAccessPassTokenOrDeleteOld,
} from "./server-paid-access-passes/db-requests";
import {
  checkUserIsAdminOrHasAccessToLayer,
  createOrUpdateRole,
  createSimpleRole,
  hasHigherRoles,
  reassureInstitutionAccess,
} from "./server-role";
import { getUserQuantityInformation } from "./server-stripe";
import { getUserData } from "./server-user";

export const createEmailInvites = async (
  data: ServerCreateEmailInstitutionInvites | ServerCreateEmailLayerInvite,
) => {
  log.info("creatingEmailInvite", data);

  const promises: Promise<any>[] = [];
  const { emails, inviteType, institutionId, role, userId } = data;
  if (emails.length === 0) throw new Error("No emails provided");

  const layerId =
    inviteType === "email-institution" ? institutionId : data.layerId;
  for (const email of emails) {
    promises.push(
      createSingleEmailInvite({
        email,
        layerId,
        token: createInviteToken(),
        institutionId,
        role,
        userId: userId,
      }),
    );
  }
  const res = await Promise.all(promises);
  return res;
};

export const createSingleEmailInvite = async (
  data: ServerCreateSingleEmailInvite,
): Promise<Invite> => {
  const invite = await createInvite(data);
  const { email, layerId, token, userId, language, institutionId } = data;

  if (!institutionId) throw new Error("No institutionId provided");

  await sendInviteEmail({
    email,
    layerId,
    token,
    userId,
    institutionId,
    language,
  });
  return invite;
};

export const create24hInvite = async (data: ServerCreate24hInvite) => {
  const { token, institutionId, role, layerId } = data;
  return await createInvite({
    layerId,
    institutionId,
    token,
    role,
    validFor24h: true,
  });
};

export const createInvite = async (
  data: ServerCreateSingleInvite,
): Promise<Invite> => {
  const {
    layerId,
    institutionId,
    token,
    role,
    validFor24h,
    accessPassId,
    email,
  } = data;
  return await prisma.invite.create({
    data: {
      target: layerId,
      institution_id: institutionId,
      email,
      token,
      role,
      validFor24h,
      accessPassId,
    },
  });
};

export const getInvite = async ({
  inviteId,
}: {
  inviteId: string;
}): Promise<InviteWithLayerAndAccessPassAndInstitution> => {
  const response = await prisma.invite.findMany({
    where: {
      id: inviteId,
    },
    include: {
      layer: {
        include: {
          children: true,
        },
      },
      institution: true,
      accessPass: {
        include: {
          accessPassPaymentInfo: true,
        },
      },
    },
  });
  if (!response[0]) throw new Error("No invite found");
  return response[0];
};

export const checkInvitePrechecksFailed = async ({
  userId,
  invite,
  token,
  email,
}: {
  userId: string;
  invite: InviteWithLayerAndAccessPassAndInstitution;
  token?: string;
  email?: string | null;
}): Promise<{
  alreadyHadAccessToLayer: boolean;
  validatedToken?: string | null;
  higherRolesExist: boolean;
}> => {
  let error: InviteError | undefined = undefined;

  if (!email) throw new Error("invalid-email");
  const {
    higherRolesExist,
    inviteWasCreatedWithinLast24h,
    validatedToken,
    hasExceededMaxAccessPassUsers,
    alreadyHadAccessToLayer,
    hasExceededMaxStandardSubscriptionUsers,
  } = await runInvitePrechecks(userId!, invite, email, token);

  switch (true) {
    case hasExceededMaxStandardSubscriptionUsers && !alreadyHadAccessToLayer:
      error = "exceeded-max-standard-subscription-users";
      break;
    case !email ||
      (invite.email && invite.email.toLowerCase() !== email.toLowerCase()):
      error = "invalid-email";
      break;
    case invite.accessPass && hasExceededMaxAccessPassUsers:
      error = "exceeded-max-access-pass-users";
      break;
    case invite.accessPass?.isPaid && token && !validatedToken:
      error = "invalid-token";
      break;
    case invite.validFor24h && !inviteWasCreatedWithinLast24h:
      error = "expired-invite";
      break;
  }

  if (!!error) throw new Error(error);
  return {
    validatedToken,
    alreadyHadAccessToLayer,
    higherRolesExist,
  };
};

export const updateCurrentInstitution = async ({
  institutionId,
  userId,
}: UpdateCurrentInstitutionData) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currentInstitution: institutionId,
      },
    });

    await cacheRedisHandler.invalidate.single("user-data", userId!);
    await cacheRedisHandler.invalidate.single(
      "user-courses-with-progress-data",
      userId,
    );
  } catch (e) {
    sentry.captureException(e);
    throw new Error("could-not-create-user-or-update-institution");
  }
};

async function sendInviteEmail(
  args: Omit<ServerCreateSingleEmailInvite, "role">,
) {
  const { email, layerId, token, userId, language, institutionId } = args;
  // Assuming getSettingValues is an async function that fetches institution settings
  const institution = await getSettingValues(institutionId, [
    "institution_language",
  ]);

  log.info("sendingInviteEmail", { ...args, ...institution });

  const emailServiceChain = emailService
    .create()
    .to([email])
    .from("no-reply@fuxam.com")
    .subject({
      en: "Welcome to Fuxam! - Invitation",
      de: "Willkommen bei Fuxam! - Einladung",
    });

  // Conditional addition of userId or language
  if (userId) {
    emailServiceChain.userId(userId);
  } else if (language) {
    emailServiceChain.language(language);
  } else {
    throw new Error("Either userId or language must be provided");
  }

  console.log(
    process.env.SERVER_URL ? `https://${process.env.SERVER_URL}` : "",
  );

  // Proceed to set content and send the email
  const sendEmail = emailServiceChain
    .content(
      <Email language={language || (institution.institution_language ?? "en")}>
        <Email.Header
          title={{ en: "Welcome to Fuxam!", de: "Willkommen bei Fuxam!" }}
        />
        <Email.Content
          text={{
            en: "We are delighted to inform you that you have been invited to join Fuxam, the best learning platform available. An organization has added you to their account, so you can now take advantage of everything Fuxam has to offer. /n Fuxam is an online platform that allows you to access up-to-date learning material and resources. With Fuxam, you can easily access course material, track your progress and stay organised. You can also join study groups, participate in discussions, and collaborate with your peers. /n We are excited that you are now part of the Fuxam-Family. To get started, simply click on the button below and follow the instructions:",
            de: "Wir freuen uns, Ihnen mitteilen zu können, dass Sie eingeladen wurden, sich Fuxam anzuschließen, der besten Lernplattform, die es gibt. Eine Organisation hat Sie ihrem Konto hinzugefügt, sodass Sie nun alles nutzen können, was Fuxam zu bieten hat. /n Fuxam ist eine Online-Plattform, die Ihnen Zugang zu aktuellen Lernmaterialien und Ressourcen ermöglicht. Mit Fuxam können Sie ganz einfach auf Kursmaterialien zugreifen, Ihren Fortschritt verfolgen und sich organisieren. Sie können auch Studiengruppen beitreten, an Diskussionen teilnehmen und mit Ihren Kommilitonen zusammenarbeiten. /n Wir sind begeistert, dass Sie jetzt Teil der Fuxam-Familie sind. Um zu beginnen, klicken Sie einfach auf den unten stehenden Button und folgen Sie den Anweisungen:",
          }}
        />
        <Email.Button
          link={`${env.SERVER_URL}/invitation/${layerId}/${token}`}
          text={{
            en: "Join now",
            de: "Jetzt beitreten",
          }}
        />
      </Email>,
    )
    .send();

  await sendEmail;
}

export function createInviteToken() {
  const token =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  return token;
}

export async function countPendingInvitesForLayer(
  layerId: string,
  role: Role | undefined,
) {
  return await prisma.invite.count({
    where: {
      target: layerId,
      validFor24h: false,
      role: role,
    },
  });
}

export async function revokePendingInvitesForLayer(layerId: string) {
  return await prisma.invite.deleteMany({
    where: {
      target: layerId,
      validFor24h: false,
    },
  });
}

export const updateInviteToHasBeenUsed = async (id: string) => {
  try {
    await prisma.invite.update({
      where: { id },
      data: {
        hasBeenUsed: true,
      },
    });
  } catch (e) {
    throw new Error("could-not-set-invite-to-has-been-used");
  }
};

export const runInvitePrechecks = async (
  userId: string,
  invite: InviteWithLayerAndAccessPassAndInstitution,
  email: string,
  token?: string,
): Promise<{
  higherRolesExist: boolean;
  hasExceededMaxAccessPassUsers: boolean;
  validatedToken: string | null;
  inviteWasCreatedWithinLast24h: boolean;
  hasExceededMaxStandardSubscriptionUsers: boolean;
  alreadyHadAccessToLayer: boolean;
}> => {
  const promises: Promise<any>[] = [];
  promises.push(
    hasHigherRoles({
      userId,
      layerId: invite.target,
      institutionId: invite.institution_id,
      role: invite.role,
    }),
    checkHasExceededMaxUsersOfStandardSubscriptionAndNotify(invite, email),
  );
  promises.push(
    checkUserIsAdminOrHasAccessToLayer({
      layerId: invite.target,
      institutionId: invite.institution_id,
      userId,
    }),
  );

  if (invite.accessPassId) {
    promises.push(checkHasExceededMaxUsersOfAccessPass(invite.accessPass));
    if (invite.accessPass?.isPaid && token) {
      promises.push(
        getValidatedAccessPassTokenOrDeleteOld({
          userId,
          token,
          accessPassPaymentInfoId: invite.accessPass.accessPassPaymentInfoId,
        }),
      );
    }
  }

  const [
    higherRolesExist,
    hasExceededMaxStandardSubscriptionUsers,
    alreadyHadAccessToLayer,
    accessPassUsersHaveBeenExceeded,
    validatedToken,
  ] = await Promise.all(promises);

  const inviteWasCreatedWithinLast24h =
    checkInviteWasCreatedWithinLast24h(invite);
  return {
    higherRolesExist,
    inviteWasCreatedWithinLast24h,
    hasExceededMaxStandardSubscriptionUsers:
      !alreadyHadAccessToLayer && hasExceededMaxStandardSubscriptionUsers,
    alreadyHadAccessToLayer,
    hasExceededMaxAccessPassUsers:
      !alreadyHadAccessToLayer && accessPassUsersHaveBeenExceeded,
    validatedToken,
  };
};

export const checkHasExceededMaxUsersOfStandardSubscriptionAndNotify = async (
  invite: Invite,
  rejectedEmail: string,
) => {
  const { willExceedMaxUsersIfOneMoreIsAdded } =
    await getUserQuantityInformation(invite.institution_id);
  if (!invite.accessPassId && willExceedMaxUsersIfOneMoreIsAdded) {
    //TODO: Send notification
    return true;
  }
  return false;
};

export const runRoleUpdates = async (
  userId: string,
  invite: InviteWithLayerAndAccessPassAndInstitution,
) => {
  const { role, institution_id, target } = invite;
  try {
    if (institution_id === target) {
      return await runInstitutionInviteRoleUpdates(userId, invite);
    } else {
      await createOrUpdateRole({
        institutionId: institution_id,
        layerId: target,
        role: role as Role,
        userId,
        setActive: true,
      });
    }
  } catch (e) {
    sentry.captureException(e);
    throw new Error("could-not-create-role");
  }
};

export const checkInviteWasCreatedWithinLast24h = (
  invite: InviteWithLayerAndAccessPassAndInstitution,
): boolean => {
  const time = new Date(Date.now() - 60 * 60 * 24 * 1000).getTime();
  return invite.createdAt.getTime() > time;
};

export const runInstitutionInviteRoleUpdates = async (
  userId: string,
  invite: InviteWithLayerAndAccessPassAndInstitution,
) => {
  const { role, institution_id, target } = invite;
  if (role === "moderator" || role === "educator") {
    throw new Error("moderator-educator-cant-get-institution-access");
  }
  await createSimpleRole({
    userId,
    layerId: target,
    institutionId: institution_id,
    role: role as Role,
    active: true,
  });
  if (role === "admin") {
    await runAdminRoleUpdates(userId, invite);
  }
};

export const runAdminRoleUpdates = async (
  userId: string,
  invite: InviteWithLayerAndAccessPassAndInstitution,
) => {
  const { target, institution_id, institution } = invite;
  const institutionId = institution_id;
  const layerId = target;
  await createOrUpdateRole({
    institutionId,
    layerId,
    role: "moderator",
    userId,
  });
  if (!institution) return;
  //TODO: Send notification
};

export const getRolesWithAccess = (type: InviteType): Role[] => {
  switch (type) {
    case "email-institution":
      return ["admin"];
    case "email-layer":
    case "24h":
      return ["admin", "moderator", "educator"];
  }
};
export const getInviteAndToken = async (req: NextApiRequest) => {
  const { inviteId, token } = JSON.parse(req.body);
  const invite = await getInvite({ inviteId });
  if (!invite) throw new Error("invalid-invite");
  return { invite, token };
};

export const processInvitePrechecks = async ({
  invite,
  userId,
  token,
  email,
}: {
  invite: InviteWithLayerAndAccessPassAndInstitution;
  userId: string;
  token: string;
  email: string;
}) => {
  sentry.addBreadcrumb({ message: "Process invite pre-checks" });

  /** Email, Max User, Higher Roles, Access Pass Token Prechecks */
  const { validatedToken, higherRolesExist, alreadyHadAccessToLayer } =
    await checkInvitePrechecksFailed({
      invite,
      userId,
      token,
      email,
    });
  const doesNotNeedToRedoCoreInviteProcess =
    higherRolesExist || alreadyHadAccessToLayer;

  return { validatedToken, doesNotNeedToRedoCoreInviteProcess };
};

export const handleNonCoreInviteProcess = async ({
  userId,
  institutionId,
  invite,
}: {
  userId: string;
  institutionId: string;
  invite: InviteWithLayerAndAccessPassAndInstitution;
}) => {
  sentry.addBreadcrumb({
    message: "Should redo core-invite process",
    data: { userId, invite },
  });

  await updateCurrentInstitution({
    userId,
    institutionId,
  });

  const newUserData = await getUserData(userId);
  if (!invite.validFor24h && !invite.accessPassId) {
    await updateInviteToHasBeenUsed(invite.id);
  }
  await cacheRedisHandler.set("user-data", userId, newUserData);
};

export const handleCoreInviteProcess = async ({
  institutionId,
  userId,
  invite,
}: {
  institutionId: string;
  userId: string;
  invite: InviteWithLayerAndAccessPassAndInstitution;
  validatedToken: string | null | undefined;
}) => {
  sentry.addBreadcrumb({
    message: "handle core invite process",
    data: { institutionId, userId, invite },
  });

  /** Core Invite Process */

  await reassureInstitutionAccess(userId, institutionId);
  await updateCurrentInstitution({
    userId,
    institutionId,
  });
  await runRoleUpdates(userId, invite);
};

export const handleAfterInviteCompleted = async ({
  invite,
  userId,
  validatedToken,
}: {
  invite: InviteWithLayerAndAccessPassAndInstitution;
  userId: string;
  validatedToken: string | null | undefined;
}) => {
  /** Steps that happen after invite was successfully completed */
  sentry.addBreadcrumb({
    message: "invite completed, run handleAfterInviteCompleted",
  });

  if (invite.accessPassId) {
    await createUsageLogs(userId, invite.accessPass);
    validatedToken &&
      (await deleteValidatorToken({
        userId,
        token: validatedToken,
      }));
  }
  if (!invite.validFor24h && !invite.accessPassId)
    await updateInviteToHasBeenUsed(invite.id);

  const newUserData = await getUserData(userId);
  cacheRedisHandler.set("user-data", userId, newUserData);

  return newUserData;
};

export const handleAccessPassPayment = async ({
  invite,
  token,
  userId,
}: {
  invite: InviteWithLayerAndAccessPassAndInstitution;
  token: string;
  userId: string;
}) => {
  let link: string | null = null;

  sentry.addBreadcrumb({
    message: "Should handleAccessPassPayment",
    data: { invite, token },
  });

  /** Access Pass Payment */
  if (invite.accessPass?.isPaid && !token) {
    link = await createUserCheckoutSession({
      invite,
      userId,
    });
  }
  return link;
};
