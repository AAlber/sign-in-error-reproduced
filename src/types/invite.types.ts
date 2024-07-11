import type { AccessPass, Institution, Invite, Layer } from "@prisma/client";
import type { AccessPassWithPaymentInfo } from "../utils/stripe-types";
import type { UserData } from "./user-data.types";

export type InviteType = "email-institution" | "email-layer" | "24h";
export type InviteAccessType = "institution" | "layer";

export interface CreateEmailInstitutionInvites {
  inviteAccessType: Extract<InviteAccessType, "institution">;
  inviteType: Extract<InviteType, "email-institution">;
  role: "admin" | "member";
  emails: string[];
}

export interface CreateEmailLayerInvite {
  inviteAccessType: Extract<InviteAccessType, "layer">;
  inviteType: Extract<InviteType, "email-layer">;
  role: "moderator" | "educator" | "member";
  emails: string[];
  layerId: string;
}

export interface Create24hInvite {
  role: "member";
  inviteAccessType: Extract<InviteAccessType, "layer">;
  inviteType: Extract<InviteType, "24h">;
  layerId: string;
  token: string;
}

export type CreateInvite =
  | CreateEmailInstitutionInvites
  | CreateEmailLayerInvite
  | Create24hInvite;

type SecurityTokenAndInstitutionId = {
  institutionId: string;
  token: string;
};

export type ServerCreateEmailInstitutionInvites =
  CreateEmailInstitutionInvites & { institutionId: string; userId: string };

export type ServerCreateEmailLayerInvite = CreateEmailLayerInvite & {
  institutionId: string;
  userId: string;
};

export type ServerCreate24hInvite = Create24hInvite &
  SecurityTokenAndInstitutionId;

export type InviteWithLayerAndAccessPass = Invite & {
  layer: Layer;
  accessPass?: AccessPassWithPaymentInfo | null;
};

export type InviteWithLayerInstitutionAndAccessPass = Invite & {
  layer: Layer;
  institution: Institution;
  accessPass?: AccessPass | null;
};

export interface JoinInvite {
  inviteId: string;
  token?: string;
  // some kind of type for whats being send when you go to the fuxam.de/invitation/....
}

export interface ServerCreateSingleInvite {
  layerId: string;
  institutionId: string;
  token: string;
  role: "admin" | "moderator" | "educator" | "member";
  validFor24h?: boolean;
  accessPassId?: string;
  email?: string;
}
interface ServerCreateSingleEmailInviteBase {
  email: string;
}

type UserIdOrLanguage =
  | { userId: string; language?: never }
  | { userId?: never; language: Language };

export type ServerCreateSingleEmailInvite = ServerCreateSingleInvite &
  UserIdOrLanguage &
  ServerCreateSingleEmailInviteBase;

export interface InviteResponse {
  success: boolean;
  result?: any;
  updatedUser?: UserData;
  resultType?: InviteResultType;
  errorObject?: any;
  error?: InviteError;
}

export type UpdateCurrentInstitutionData = {
  userId: string;
  institutionId: string;
};

export type ReassureInstitutionAccessData = {
  userId: string;
  institutionId: string;
};

export type InviteWithLayerAndAccessPassAndInstitution =
  InviteWithLayerAndAccessPass & {
    institution: Institution;
  };

type InviteResultType = "redirect";

export type InviteError =
  | "user-not-found"
  | "invalid-email"
  | "could-not-create-user-or-update-institution"
  | "invalid-invite"
  | "invalid-invite-client"
  | "could-not-create-role"
  | "could-not-reassure-institution-access"
  | "higher-roles-exist"
  | "exceeded-max-access-pass-users"
  | "exceeded-max-standard-subscription-users"
  | "unknown-error"
  | "moderator-educator-cant-get-institution-access"
  | "invalid-token"
  | "expired-invite"
  | "couldnt-delete-token"
  | "no-token-to-delete"
  | "could-not-create-usage-logs"
  | "exited-payment-portal-without-paying"
  | "could-not-set-invite-to-has-been-used";
