import { dequal } from "dequal";
import type { MoodleIntegrationDataPoint } from "@/src/components/institution-settings/setting-containers/insti-settings-moodle/schema";
import { prisma } from "@/src/server/db/client";
import { MoodleWebServiceClient } from "./moodle-client";
import {
  syncFuxamAppointmentsToMoodle,
  syncFuxamCoursesToMoodle,
  syncFuxamUsersToMoodle,
} from "./sync-fuxam-to-moodle";
import {
  convertMoodleEventsToFuxamAppointments,
  syncMoodleCoursesToFuxam,
  syncMoodleUsersToFuxam,
} from "./sync-moodle-to-fuxam";

export async function deleteMoodleIntegration(institutionId: string) {
  const exists = await prisma.moodleIntegration.findFirst({
    where: { institutionId },
  });

  if (!exists) return;
  await prisma.moodleIntegration.delete({ where: { institutionId } });
}

export async function syncMoodleDataPoints(args: {
  institutionId: string;
  dataPoints: MoodleIntegrationDataPoint;
  userId: string;
}) {
  const { dataPoints, institutionId, userId } = args;

  // verify record exists
  const { data, apiKey, siteUrl } =
    await prisma.moodleIntegration.findFirstOrThrow({
      where: { institutionId },
    });

  // only update if there is a change in dataPoints
  if (!dequal(data, dataPoints)) {
    await prisma.moodleIntegration.update({
      where: { institutionId },
      data: { data: dataPoints },
    });
  }

  const moodleClient = new MoodleWebServiceClient(apiKey, siteUrl);

  // sync users first before syncing courses
  if (dataPoints.users !== "no-transfer") {
    await syncMoodleUsersToFuxam(moodleClient, institutionId);
    if (dataPoints.users === "both-ways")
      await syncFuxamUsersToMoodle(moodleClient, institutionId);
  }

  if (dataPoints.courses !== "no-transfer") {
    await syncMoodleCoursesToFuxam(moodleClient, institutionId, userId);
    if (dataPoints.courses === "both-ways") {
      await syncFuxamCoursesToMoodle(moodleClient, institutionId);
    }
  }

  if (dataPoints.appointments !== "no-transfer") {
    await convertMoodleEventsToFuxamAppointments(
      moodleClient,
      institutionId,
      userId,
    );
    if (dataPoints.appointments === "both-ways") {
      await syncFuxamAppointmentsToMoodle(moodleClient, institutionId);
    }
  }
}

export async function setMoodleCredentials(args: {
  apiKey: string;
  siteUrl: string;
  institutionId: string;
}) {
  const { institutionId, ...credentials } = args;
  const moodleClient = new MoodleWebServiceClient(
    credentials.apiKey,
    credentials.siteUrl,
  );

  // simulate login to moodle site, check if credentials are valid
  await moodleClient.getSiteInfo();

  return await prisma.moodleIntegration.upsert({
    where: { institutionId },
    update: credentials,
    create: {
      ...credentials,
      institutionId,
    },
  });
}
