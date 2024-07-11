import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { InstitutionSettings } from "../types/institution-settings.types";
import useUser from "../zustand/user";

export async function getInstitutionSettings(): Promise<InstitutionSettings> {
  const response = await fetch(api.getInstitutionSettings, { method: "GET" });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_organization_settings_error1",
    });
  }
  return await response.json();
}

export async function getInstitutionStripeAccount(): Promise<InstitutionSettings> {
  const response = await fetch(api.getInstitutionSettings, { method: "GET" });
  if (!response.ok) {
    toast.responseError({
      response: response,
      title: "Failed to get institution settings",
    });
  }
  return await response.json();
}

export async function getInstitutionSettingsValues(
  keys: (keyof InstitutionSettings)[],
): Promise<Pick<InstitutionSettings, keyof InstitutionSettings> | null> {
  const response = await fetch(api.getInstitutionSettingsValues, {
    method: "POST",
    body: JSON.stringify({ keys }),
  });
  if (!response.ok) return null;
  const settings = await response.json();

  return settings as Pick<InstitutionSettings, keyof InstitutionSettings>;
}

export async function getInstitutionSettingsProfileDataPoints(): Promise<Partial<InstitutionSettings> | null> {
  const response = await fetch(api.getInstitutionSettingsProfileDataPoints, {
    method: "GET",
  });
  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_organization_settings_error2",
    });
    return null;
  }
  const settings = await response.json();

  return settings as Partial<InstitutionSettings>;
}

export async function uploadInstitutionSettings(settings: InstitutionSettings) {
  const { user, setUser } = useUser.getState();

  const response = await fetch(api.updateInstitutionSettings, {
    method: "POST",
    body: JSON.stringify({
      settings,
    }),
  });

  if (!response.ok) {
    toast.responseError({
      response,
      title: "toast_organization_settings_error3",
    });
  }
  if (user.institution)
    setUser({
      institution: { ...user.institution, institutionSettings: settings },
    });

  return await response.json();
}

export async function uploadInstitutionSettingsWithProcessToast(
  settings: InstitutionSettings,
) {
  const { user, setUser } = useUser.getState();
  await toast.transaction({
    processMessage: "toast_organization_settings_process",
    successMessage: "toast_organization_settings_success",
    errorMessage: "toast_organization_settings_error3",
    transaction: async () =>
      fetch(api.updateInstitutionSettings, {
        method: "POST",
        body: JSON.stringify({
          settings: settings,
        }),
      }),
  });
  if (user.institution)
    setUser({
      institution: {
        ...user.institution,
        institutionSettings: settings,
      },
    });
}

export async function removeAdminRole(userId: string) {
  const response = await fetch(api.removeAdminRole, {
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
  });
  if (!response.ok)
    return toast.responseError({
      response,
      title: "toast_organization_settings_error5",
    });

  return response;
}

export async function validateOpenAIApiKey(key: string): Promise<boolean> {
  const response = await fetch(api.testaiKey, {
    method: "POST",
    body: JSON.stringify({
      key: key,
    }),
  });
  if (!response.ok) return false;
  return true;
}

export async function getInstitutionStorageSettings() {
  const response = await fetch(api.getInstitutionStorageStatus, {
    method: "GET",
  });
  if (!response.ok) {
    toast.error("failed_to_get_storage_settings", {
      description: "failed_to_get_storage_settings_description",
    });
  }
  return await response.json();
}
