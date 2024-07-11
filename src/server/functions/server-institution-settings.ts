import type {
  InstitutionR2Object,
  InstitutionStripeAccount,
} from "@prisma/client";
import type Prisma from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import type OpenAI from "openai";
import type {
  VideoChatProviderId,
  VideoChatProviderInstitutionSettingsProps,
} from "@/src/types/video-chat-provider-integration.types";
import type { InstitutionSettings } from "../../../src/types/institution-settings.types";
import {
  defaultInstitutionSettings,
  protectedInstitutionSettings,
} from "../../../src/types/institution-settings.types";
import cacheRedisHandler from "../../../src/utils/cache-handler/cache-redis-handler";
import { boostedPrisma, prisma } from "../db/client";
import { openai } from "../singletons/openai";
import { sentry } from "../singletons/sentry";

export async function getInstitutionSettings(
  institutionId: string,
): Promise<InstitutionSettings> {
  sentry.addBreadcrumb({
    message: "getInstitutionSettings",
    data: { institutionId },
  });

  const institutionSettingsDatabaseInstance =
    await boostedPrisma.institutionSettings.findFirst({
      where: { institutionId },
      select: { settings: true },
    });

  if (!institutionSettingsDatabaseInstance) {
    await setInstitutionSettings(institutionId, defaultInstitutionSettings);
    return defaultInstitutionSettings;
  }

  const settings =
    institutionSettingsDatabaseInstance.settings as Partial<InstitutionSettings>;

  for (const [key, defaultValue] of Object.entries(
    defaultInstitutionSettings,
  )) {
    if (!settings.hasOwnProperty(key)) {
      settings[key] = defaultValue;
      await setInstitutionSettings(institutionId, settings);
    }
  }

  const hasVideoChatProviders =
    settings.videoChatProviders &&
    defaultInstitutionSettings.videoChatProviders;

  if (hasVideoChatProviders) {
    for (const defaultProvider of defaultInstitutionSettings.videoChatProviders) {
      // Check if settings.videoChatsProvider has an item with the same id as defaultProvider
      const existsInSettings = settings.videoChatProviders!.some(
        (provider) => provider.id === defaultProvider.id,
      );

      // If the id is not found in settings.videoChatsProvider, add the defaultProvider
      if (!existsInSettings) {
        settings.videoChatProviders!.push(defaultProvider);

        // Save the updated settings
        await setInstitutionSettings(institutionId, settings);
      }
    }
  }
  return settings as InstitutionSettings;
}

export async function setInstitutionSettings(
  institutionId: string,
  settings: Partial<InstitutionSettings>,
) {
  const result = await boostedPrisma.institutionSettings.upsert({
    where: { institutionId },
    create: {
      institutionId,
      settings,
    },
    update: {
      settings,
    },
  });

  await cacheRedisHandler.invalidate.custom({
    prefix: "user-data",
    searchParam: institutionId,
    type: "single",
    origin: "server-institution-settings.ts (setInstitutionSettings)",
  });
  return result;
}

export async function getSettingValue(
  institutionId: string,
  setting: keyof InstitutionSettings,
) {
  const settings = await getInstitutionSettings(institutionId);
  return settings[setting];
}

export async function updatePartialInstitutionSettings(
  institutionId: string,
  settings: Partial<InstitutionSettings>,
) {
  sentry.addBreadcrumb({
    message: "run updatePartialInstitutionSettings",
  });

  const currentSettings = await getInstitutionSettings(institutionId);
  const newSettings = { ...currentSettings, ...settings };
  await setInstitutionSettings(institutionId, newSettings);
  await cacheRedisHandler.invalidate.custom({
    prefix: "user-data",
    searchParam: institutionId,
    type: "single",
    origin: "server-institution-settings.ts (updatePartialInstitutionSettings)",
  });
  return newSettings;
}

export async function getSettingValues(
  institutionId: string,
  keys: (keyof InstitutionSettings)[],
): Promise<Partial<InstitutionSettings>> {
  sentry.addBreadcrumb({
    message: "Getting settings values",
    data: { institutionId },
  });
  const settings = await getInstitutionSettings(institutionId);
  sentry.addBreadcrumb({ message: "Got settings values", data: { settings } });
  return keys.reduce((selectedSettings, key) => {
    return { ...selectedSettings, [key]: settings[key] };
  }, {} as Partial<InstitutionSettings>);
}

export async function getOpenAIInstance(
  institutionId: string,
): Promise<{ openai: OpenAI; usesOwnKey: boolean }> {
  return { openai: openai, usesOwnKey: false };
}

export function getOpenAIInstanceBySettings(
  aiSettings: Partial<InstitutionSettings>,
): OpenAI {
  return openai;
}

export async function getInstitutionSettingsUserData(
  institutionId: string,
): Promise<Partial<InstitutionSettings>> {
  const institutionSettings = await getInstitutionSettings(institutionId);
  const keys = Object.keys(defaultInstitutionSettings);
  const userDataKeys = keys.filter((key) => {
    return key.startsWith("user_data") && institutionSettings[key] === true;
  });
  const userData = await getSettingValues(
    institutionId,
    userDataKeys as (keyof InstitutionSettings)[],
  );
  return userData;
}

export function isProtectedSettingsValue(key: keyof InstitutionSettings) {
  return protectedInstitutionSettings.includes(key);
}

export function includesProtectedSettingsValue(
  keys: (keyof InstitutionSettings)[],
) {
  return keys.some((key) => {
    return isProtectedSettingsValue(key);
  });
}

export function isVideoChatProviderEnabled(
  id: VideoChatProviderId,
  videoChatProviders: VideoChatProviderInstitutionSettingsProps[],
) {
  return (
    videoChatProviders.find((provider) => provider.id === id)?.active || false
  );
}

export const getUserWithInclude = async (
  userId: string,
  data: Prisma.Prisma.UserInclude<DefaultArgs> | null | undefined,
) => {
  const res = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: data,
  });
  return res;
};

export const getCurrentInstitutionWithSettings = async (userId: string) => {
  const res = await getUserWithInclude(userId, {
    institution: {
      select: {
        settings: true,
      },
    },
  });
  const institution =
    res &&
    "institution" in res &&
    (res?.institution as Prisma.Institution & {
      settings: InstitutionSettings;
    });
  if (!institution) return null;
  return institution;
};

export const getInstitutionWithStorageSizeAndSettings = async (
  userId: string,
) => {
  const res = await getUserWithInclude(userId, {
    institution: {
      select: {
        settings: true,
        r2Objects: true,
        stripeAccount: true,
      },
    },
  });
  const institution =
    res &&
    "institution" in res &&
    (res?.institution as {
      settings: {
        id: string;
        settings: InstitutionSettings;
        institutionId: string;
      };
      stripeAccount: InstitutionStripeAccount | null;
      r2Objects: InstitutionR2Object[];
    });
  if (!institution) return null;
  return institution;
};
