// import { filterUndefined } from "../src/client-functions/client-utils";
import { syncStorages } from "./sync-cloudflare-to-db";

export function filterUndefined<T>(value: T | undefined): value is T {
  return !!value;
}
export default async function syncInstitutionToCloudflare({
  institutionId,
}: {
  institutionId: string;
}) {
  try {
    await syncStorages(institutionId);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
