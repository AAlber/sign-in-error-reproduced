import type { Invite } from "@prisma/client";
import type { NextRouter } from "next/router";
import usePersistInvite from "../components/invitation/persist-invite-zustand";
import useInvitation from "../components/invitation/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type {
  Create24hInvite,
  CreateEmailInstitutionInvites,
  CreateEmailLayerInvite,
  CreateInvite,
  InviteError,
  InviteResponse,
  InviteWithLayerInstitutionAndAccessPass,
  JoinInvite,
} from "../types/invite.types";
import useUser from "../zustand/user";

export const createEmailInstitutionInvites = async (
  data: Pick<CreateEmailInstitutionInvites, "emails" | "role">,
) => {
  const inviteData: CreateEmailInstitutionInvites = {
    ...data,
    inviteAccessType: "institution",
    inviteType: "email-institution",
  };
  return await createInvite(inviteData);
};

export const createEmailLayerInvites = async (
  data: Pick<CreateEmailLayerInvite, "emails" | "role" | "layerId">,
) => {
  const inviteData: CreateEmailLayerInvite = {
    ...data,
    inviteAccessType: "layer",
    inviteType: "email-layer",
  };
  return await createInvite(inviteData);
};

export const create24hInvite = async (
  data: Pick<Create24hInvite, "token" | "layerId">,
) => {
  const inviteData: Create24hInvite = {
    ...data,
    role: "member",
    inviteAccessType: "layer",
    inviteType: "24h",
  };
  return await createInvite(inviteData);
};

export const getInvite = async (
  target,
  token,
): Promise<InviteWithLayerInstitutionAndAccessPass | null> => {
  const response = await fetch(api.getInvite + target + "?token=" + token, {
    method: "GET",
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data;
};

export const getInviteForEmail = async (
  email: string,
): Promise<Invite | null> => {
  const response = await fetch(api.getInviteForEmail + "?email=" + email, {
    method: "GET",
  });
  if (!response.ok) {
    toast.responseError({ response });
    return null;
  }
  const data = await response.json();
  return data;
};

export async function createInvite(data: CreateInvite) {
  const response = await fetch(api.createInvite, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok)
    return toast.responseError({
      response,
      title: "toast_user_management_error6",
    });

  return;
}

export async function joinInvite(data: JoinInvite): Promise<InviteResponse> {
  const response = await fetch(api.joinInvite, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok)
    throw new Error("Failed to properly handle Invite Response");
  return await response.json();
}

export const getTargetAndToken = (router: NextRouter) => {
  const data = router.query.invitation as string[];
  if (!data) return { target: undefined, token: undefined };
  const target = data[0];
  const token = data[1];
  return { target, token };
};
export const onInitialLoad = async (router: NextRouter, userId?: string) => {
  const { setInviteResponse } = useInvitation.getState();
  const { setPersistedInvite, persistedInvite } = usePersistInvite.getState();

  if (!router.isReady) return;
  const data = router.query.invitation as string[];
  const target = data[0];
  const token = data[1];

  const newInvite = await getInvite(target, token);
  if (newInvite?.hasBeenUsed) {
    router.push("/");
    return;
  }
  if (!newInvite) {
    setInviteResponse({
      success: false,
      error: "invalid-invite-client",
    });
    return;
  }
  if (newInvite.id === persistedInvite?.id) {
    window.location.assign(
      `/process-invitation/${persistedInvite?.target}/${persistedInvite?.token}`,
    );
  }
  setPersistedInvite(newInvite);
};

export const onInitialInviteLoad = async (
  router: NextRouter,
  setAccessPassValidatorToken: (token: string | undefined) => void,
  userId?: string,
) => {
  const { setLoading, setInvite, setInviteResponse } = useInvitation.getState();
  setLoading(true);
  if (!router.isReady) return;
  const data = router.query.invitation as string[];
  const target = data[0];
  const token = data[1];
  if (data.length === 3) {
    setAccessPassValidatorToken(data[2]);
  }
  const newInvite = await getInvite(target, token);
  if (newInvite?.hasBeenUsed) {
    router.push("/");
    return;
  }
  if (!newInvite) {
    setInviteResponse({
      success: false,
      error: "invalid-invite-client",
    });
    setLoading(false);
    return;
  }
  setInvite(newInvite);
  setLoading(false);
};

export const onReceiveInviteResponse = async (router: NextRouter) => {
  const { setUser } = useUser.getState();
  const { inviteResponse, setLoading } = useInvitation.getState();
  if (!inviteResponse) return;
  if (inviteResponse.updatedUser) setUser(inviteResponse.updatedUser);

  if (inviteResponse?.success) {
    if (inviteResponse.resultType === "redirect") {
      window.location.href = inviteResponse.result;
    } else {
      router.push("/?page=COURSES&actions=open:welcome-learn-menu");
    }
  } else {
    if (redirectAnywayErrors.includes(inviteResponse?.error as InviteError)) {
      router.push("/?page=COURSES&actions=open:welcome-learn-menu");
    }
  }
  setLoading(false);
};

export const onCompletedAccessPassPayment = async (
  validatorToken: string | undefined,
) => {
  const { setLoading, invite, setInviteResponse } = useInvitation.getState();
  if (validatorToken && invite) {
    setLoading(true);
    const res = await joinInvite({
      inviteId: invite!.id,
      token: validatorToken,
    });
    setInviteResponse(res);
  }
};

export const getCorrectErrorMessages = (inviteResponse: InviteResponse) => {
  const errorTag = inviteResponse.error as InviteError;
  let errorMessage,
    errorSubtitle = "";
  if (explainedErrors.includes(errorTag)) {
    errorMessage = getTitle(errorTag);
    errorSubtitle = getDescription(errorTag) || "";
  } else {
    const errorCode = getErrorCode(errorTag) ? getErrorCode(errorTag) : 499;
    errorMessage = "Error " + errorCode;
    errorSubtitle = "contact_support_email";
  }
  return { errorMessage, errorSubtitle };
};

export const somethingWentWrongErrors = {
  "could-not-create-user-or-update-institution": 501,
  "could-not-create-role": 502,
  "could-not-reassure-institution-access": 503,
  "moderator-educator-cant-get-institution-access": 505,
};

export const shouldShowLoader = () => {
  const { inviteResponse, loading, invite } = useInvitation.getState();
  const isErrorWhereWeRedirectAnyway =
    inviteResponse &&
    !inviteResponse.success &&
    redirectAnywayErrors.includes(inviteResponse.error as InviteError);
  return (
    loading ||
    inviteResponse?.success ||
    isErrorWhereWeRedirectAnyway ||
    invite?.hasBeenUsed
  );
};

export const getErrorCode = (error: InviteError) => {
  return somethingWentWrongErrors[error];
};

type InviteErrorEntry = { title: string; description: string };

type InviteErrorsJsonType = {
  [K in InviteError]?: InviteErrorEntry;
};

export const explainedErrorsJson: InviteErrorsJsonType = {
  "invalid-email": {
    title: "invalid_email_title",
    description: "invalid_email_description",
  },
  "invalid-invite": {
    title: "invalid-invite_title",
    description: "invalid-invite_description",
  },
  "invalid-invite-client": {
    title: "invalid-invite-client_title",
    description: "invalid-invite_description",
  },
  "expired-invite": {
    title: "expired-invite_title",
    description: "expired-invite_description",
  },
  "higher-roles-exist": {
    title: "higher-roles-exist_title",
    description: "higher-roles-exist_description",
  },
  "exceeded-max-access-pass-users": {
    title: "exceeded-max-access-pass-users_title",
    description: "exceeded-max-access-pass-users_description",
  },
  "exceeded-max-standard-subscription-users": {
    title: "exceeded-max-standard-subscription-users_title",
    description: "exceeded-max-standard-subscription-users_description",
  },
  "exited-payment-portal-without-paying": {
    title: "exited-payment-portal-without-paying_title",
    description: "exited-payment-portal-without-paying_description",
  },
};

export function getTitle(errorKey: InviteError) {
  const error = explainedErrorsJson[errorKey];
  return error ? error.title : null;
}

export function getDescription(errorKey: InviteError) {
  const error = explainedErrorsJson[errorKey];
  return error ? error.description : null;
}

export const redirectAnywayErrors: InviteError[] = [
  "couldnt-delete-token",
  "no-token-to-delete",
  "could-not-set-invite-to-has-been-used",
  "could-not-create-usage-logs",
];

function getKeysOfJson(jsonObj: InviteErrorsJsonType): InviteError[] {
  return Object.keys(jsonObj) as InviteError[];
}

export const explainedErrors: InviteError[] =
  getKeysOfJson(explainedErrorsJson);
