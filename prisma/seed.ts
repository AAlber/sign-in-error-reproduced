
import { StreamChat } from "stream-chat";
import type { StreamChatGenerics } from "../src/components/reusable/page-layout/navigator/chat/types";
import addSubscriptionToInstitution from "./add-subscription-to-institution";
import addUsersToInstitutions from "./add-users-to-institution";
import createInstitution from "./create-institution";
import devsGetSubscribtion from "./devs-get-subscription";
import extendSubscriptionOfInstitution from "./extend-subscription-of-institution";
import getUsersOfInstitution from "./get-users-of-institution";
import randomSeedOperation from "./random-seed";
import syncDbToCloudflare from "./sync-cloudflare-to-db";
import syncInstitutionToCloudflare from "./sync-institutition-with-cloudflare";

export const streamChat = new StreamChat<StreamChatGenerics>(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET,
);

enum SeedFileToRun {
  ADD_USERS_TO_INSTITUTION,
  GET_USERS_OF_INSTITUTION,
  DEVS_GET_SUBSCRIPTION,
  ADD_SUBSCRIPTION_TO_INSTITUTION,
  CREATE_INSTITUTION,
  RANDOM_SEED,
  EXTEND_SUBSCRIPTION_OF_INSTITUTION,
  SYNC_INSTITUTION_TO_CLOUDFLARE,
  SYNC_DB_TO_CLOUDFLARE,
  undefined,
}

const {
  ADD_SUBSCRIPTION_TO_INSTITUTION,
  ADD_USERS_TO_INSTITUTION,
  CREATE_INSTITUTION,
  DEVS_GET_SUBSCRIPTION,
  GET_USERS_OF_INSTITUTION,
  RANDOM_SEED,
  EXTEND_SUBSCRIPTION_OF_INSTITUTION,
  SYNC_INSTITUTION_TO_CLOUDFLARE,
  SYNC_DB_TO_CLOUDFLARE,
  undefined,
} = SeedFileToRun;

const seedFileToRun = RANDOM_SEED as any;

async function main() {
  switch (seedFileToRun) {
    case ADD_USERS_TO_INSTITUTION:
      await addUsersToInstitutions({
        institutionId: "cljwndkja000lp49m534sgjh2",
        userAmount: 9,
      });
      break;
    case GET_USERS_OF_INSTITUTION:
      await getUsersOfInstitution({
        institutionId: "cljwndkja000lp49m534sgjhF2",
        saveCsv: true,
      });
      break;
    case DEVS_GET_SUBSCRIPTION:
      await devsGetSubscribtion({
        environment: "dev",
        institutionName: "dizbdizdb",
        withTestClock: true,
      });
      break;
    //DANGEROUS ACTION AT THE MOMENT
    case ADD_SUBSCRIPTION_TO_INSTITUTION:
      await addSubscriptionToInstitution({
        environment: "dev",
        institutionId: "cljwndkja000lp49m534sgjh2",
        name: "Heelllooooooooo",
      });
      break;
    case CREATE_INSTITUTION:
      await createInstitution({
        name: "A great Institution",
        environment: "dev",
        language: "en",
        userIdToBeAdmin: "user_2OJpzlT54O47yF6tPUeuoiMhmOJ",
        amountOfSubscriptionMonths: 12, //undefined means two weeks(the default)
        firstAdminEmail: "",
      });
      break;
    //DANGEROUS ACTION AT THE MOMENT
    case EXTEND_SUBSCRIPTION_OF_INSTITUTION:
      await extendSubscriptionOfInstitution({
        environment: "dev",
        institutionId: "clpqsvpx80000pe9hlup486dq",
        name: "Sean's Institution",
        cancelDate: 1733832000,
      });
      break;

    case SYNC_INSTITUTION_TO_CLOUDFLARE:
      await syncInstitutionToCloudflare({
        institutionId: "cljwndkja000lp49m534sgjh2",
      });
      break;
    case SYNC_DB_TO_CLOUDFLARE:
      await syncDbToCloudflare();
      break;
    case RANDOM_SEED:
      await randomSeedOperation();
      break;
    default:
      return;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
