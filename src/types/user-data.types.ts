import type { InstitutionTheme } from "@prisma/client";
import type { FuxamStripeSubscription } from "../utils/stripe-types";
import type { InstitutionSettings } from "./institution-settings.types";

export type UserData = SimpleUser & {
  language: Language;
  streamToken: string;
  currentInstitutionId: string;
  institution: {
    id: string;
    name: string;
    logo: string | null;
    theme: InstitutionTheme;
    customThemeHEX: string;
    isUserInactive: boolean;
    highestRole: Role | null;
    hasModeratorRole: boolean;
    hasAdminRole: boolean;
    institutionSettings: Partial<InstitutionSettings>;
    stripeAccountInfo: StripeAccountInfo;
  } | null;
};

export type StripeAccountInfo = {
  supportPackage: string;
  subscription: FuxamStripeSubscription;
};
