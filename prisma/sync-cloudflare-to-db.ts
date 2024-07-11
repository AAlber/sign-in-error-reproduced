// import { filterUndefined } from "../src/client-functions/client-utils";
import type { ListObjectsV2Output } from "@aws-sdk/client-s3";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import cuid from "cuid";
import { prisma } from "../src/server/db/client";
import { R2 } from "../src/server/singletons/s3";

export function filterUndefined<T>(value: T | undefined): value is T {
  return !!value;
}
export default async function syncDbToCloudflare() {
  try {
    // Remove the comments below to enable this
    // Also, if it fails, make sure to add the completed Institutions to the initial completedInstitutions array
    // const institutions = await prisma.institution.findMany();
    // const institutionIds = institutions.map((obj) => {
    //   return obj.id
    // })
    // const completedInstitutions:string[] = []
    // institutionIds.forEach(async (institutionId) => {
    //   if (completedInstitutions.includes(institutionId)) return;
    //   await syncStorages("clvw7esp5000010z0eolldnvb")
    //  console.log("completedInstitution:", institutionId)
    //   completedInstitutions.push(institutionId)
    // })
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}

export const syncStorages = async (institutionId: string) => {
  let continuationToken;
  const allObjects: ListObjectsV2Output["Contents"] = [];
  console.log("completed:", institutionId);
  do {
    const listRequest = new ListObjectsV2Command({
      Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
      Prefix: "institutions/" + institutionId,
      ContinuationToken: continuationToken,
    });
    const result = await R2.send(listRequest);
    if (!result) return;
    allObjects.push(...(result.Contents ?? []));
    continuationToken = result.NextContinuationToken;
  } while (continuationToken);

  // storageHandler.list.r2Objects("institutions/" + institutionId);

  console.log("allObjs" + allObjects.length);
  if (!allObjects) return;
  const bean = allObjects
    ?.map((obj) => {
      return {
        key:
          obj.Key ||
          "institutions/" + institutionId + "/random-unfound/" + cuid(),
        size: obj.Size || 0,
        lastModified: obj.LastModified!,
      };
    })
    .filter(filterUndefined);
  await prisma.institutionR2Object.deleteMany({
    where: {
      institutionId,
    },
  });
  const newInstitution = await prisma.institution.update({
    where: { id: institutionId },
    data: {
      r2Objects: {
        create: bean,
      },
    },
    include: {
      r2Objects: true,
    },
  });

  console.log("completed:", institutionId);
  console.log("newInstitution", newInstitution.r2Objects.length);
};
