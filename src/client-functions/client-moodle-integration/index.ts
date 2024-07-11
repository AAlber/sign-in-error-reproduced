import type {
  MoodleCredentialsSchemaType,
  MoodleIntegration,
  MoodleIntegrationDataPoint,
} from "@/src/components/institution-settings/setting-containers/insti-settings-moodle/schema";
import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";
import type { MoodleAccountInformation } from "@/src/server/functions/server-moodle/types";

export async function deleteMoodleIntegration() {
  return fetch(api.deleteMoodleIntegration, { method: "DELETE" });
}

export async function getMoodleIntegrationData() {
  const result = await fetch(api.getMoodleIntegrationData);
  return (await result.json()) as MoodleIntegration;
}

export async function setMoodleCrendentials(
  creds: MoodleCredentialsSchemaType,
) {
  const result = await fetch(api.setMoodleCredentials, {
    body: JSON.stringify(creds),
    method: "POST",
  });

  if (!result.ok) {
    toast.error("moodle.toast.error.invalid_credentials", {
      description: "moodle.toast.error.invalid_credentials.description",
    });
    return;
  }

  toast.success("general.success", {
    description: "moodle.toast.success.integration_success",
  });

  return (await result.json()) as MoodleIntegration;
}

export async function syncMoodleDataPoints(
  dataPoints: MoodleIntegrationDataPoint,
) {
  const result = await fetch(api.syncMoodleDataPoints, {
    body: JSON.stringify(dataPoints),
    method: "POST",
  });

  if (!result.ok) {
    toast.error("something_went_wrong", {
      description: "moodle.toast.error.syncing_data",
    });

    throw new Error("Moodle Syncing error");
  }

  const data = await result.json();
  return data;
}

export async function getMoodleAccountInformation() {
  const result = await fetch(api.getMoodleAccountInformation);
  // No need to show toast here, if this fails just render null to the component thats using this fn
  if (!result.ok) throw new Error("Cannot get Moodle integration data");

  return (await result.json()) as MoodleAccountInformation;
}
