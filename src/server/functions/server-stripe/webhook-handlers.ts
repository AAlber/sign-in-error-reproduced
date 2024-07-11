import type {
  InstitutionStripeAccount,
  PaidAddOn,
  PrismaClient,
} from "@prisma/client";
import type Stripe from "stripe";
// import { isAddOnSubscription } from "@/src/client-functions/client-paid-add-ons/utils";
import { isSupportPackage } from "@/src/client-functions/client-stripe/utils";
import cacheRedisHandler from "@/src/utils/cache-handler/cache-redis-handler";
import { log } from "@/src/utils/logger/logger";
import { prisma } from "../../db/client";
import { stripe } from "../../singletons/stripe";
import { accessPassExistsAlready } from "../server-access-passes/data-extrapolation";
import {
  cancelAccessPass,
  createNewStripeAccountAndUpdateAccessPass,
  getAccessPassesOfInstitution,
  updateAccessPassAndAddCancellation,
} from "../server-access-passes/db-requests";
import { getInstitutionById } from "../server-institutions";
import {
  createNewAddOn,
  createNewStripeAccountAndPaidAddOn,
  getPaidAddOnsOfInstitution,
  updateAddOn,
} from "../server-paid-add-ons/db-requests";
import {
  getInstitutionStripeAccount,
  updateOldSubscriptionToNoLongerUsed,
  updateStripeAccountFromInstitution,
} from "./db-requests";
import { getSubscriptionType } from "./utils";
import { checkCustomerAndAccountExists } from "./webhook-mismatch-logic";

export const getSubscriptionAndInvoice = async (
  event: Stripe.Event,
  stripe: Stripe,
): Promise<{
  subscription: Stripe.Subscription;
  invoice: Stripe.Invoice;
  supportPlan?: Stripe.InvoiceLineItem;
}> => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string,
  );
  const supportPlan = getStandardSupportPlan(invoice);
  return { subscription, invoice, supportPlan };
};

const getStandardSupportPlan = (invoice: Stripe.Invoice) => {
  for (const line of invoice.lines.data) {
    if (isSupportPackage(line.price?.id as string)) {
      return line;
    }
  }
};

export const handleInvoicePaid = async ({
  event,
  stripe,
}: {
  event: Stripe.Event;
  stripe: Stripe;
}) => {
  const { subscription, supportPlan } = await getSubscriptionAndInvoice(
    event,
    stripe,
  );
  const institutionId = subscription.metadata.institutionId;
  const type = getSubscriptionType(subscription);
  let institution;

  if (supportPlan) {
    await updateInstitutionSupportPlan(institutionId as string, supportPlan);
  }
  if (institutionId) {
    const stripeAccount = await getInstitutionStripeAccount(institutionId);
    switch (type) {
      case "old-price-id":
        return;
      case "accessPass":
      case "addOn":
        // TODO: check if implementation still needed
        institution = await getInstitutionById(institutionId);
        // if (isAddOnSubscription(subscription)) {
        //   stripeAccount && (await updateAddOn(subscription, stripeAccount));
        // } else {
        //   stripeAccount &&
        //     (await updateAccessPassAndAddCancellation(
        //       subscription,
        //       stripeAccount,
        //     ));
        // }
        break;
      case "storage":
        await createOrUpdateStorageSubscription({
          stripeAccount,
          subscription,
        });
        break;
      case "stripeAccount":
        institution = await updateStripeAccountFromInstitution(
          institutionId,
          subscription,
        );
        if (institution) {
          //TODO: Send notification
        }
        break;
    }
  }
};

export const updateInstitutionSupportPlan = async (
  institutionId: string,
  supportPlan: Stripe.InvoiceLineItem,
) => {
  const instiStripeAccount = await prisma.institutionStripeAccount.update({
    where: {
      institutionId: institutionId,
    },
    data: {
      supportPackage: {
        upsert: {
          create: {
            priceId: supportPlan.price?.id as string,
            institutionId,
          },
          update: {
            priceId: supportPlan.price?.id as string,
            institutionId,
          },
        },
      },
    },
  });
  return instiStripeAccount;
};

export const createOrUpdateStorageSubscription = async ({
  stripeAccount,
  subscription,
}: {
  stripeAccount: InstitutionStripeAccount | null;
  subscription: Stripe.Subscription;
}) => {
  log
    .info("Creating and updating storage", { stripeAccount, subscription })
    .cli();
  if (!stripeAccount)
    throw new Error(
      "Should have had stripe Account before purchasing storage" +
        JSON.stringify({ stripeAccount, subscription }),
    );
  const institutionId = stripeAccount.institutionId;
  if (subscription.metadata.noLongerUSed === "true") return;
  if (
    !stripeAccount.storageSubscriptionId &&
    subscription.status !== "canceled" &&
    subscription.items.data[0]
  ) {
    await prisma.institutionStripeAccount.update({
      where: { institutionId },
      data: { storageSubscriptionId: subscription.id },
    });
  } else if (stripeAccount.storageSubscriptionId === subscription.id) {
    const isCancelled = subscription.status === "canceled";
    if (isCancelled) {
      await stripe.subscriptions.update(subscription.id, {
        metadata: {
          noLongerUsed: "true",
        },
      });
      await prisma.institutionStripeAccount.update({
        where: { institutionId },
        data: { storageSubscriptionId: null },
      });
    }
  } else throw new Error("Was able to create two ");
};

export const handleSubscriptionCreatedOrUpdated = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const {
    subscription,
    customerId,
    stripeAccount,
    mismatchStatus,
    institutionId,
  } = await checkCustomerAndAccountExists({ event, prisma });
  const type = getSubscriptionType(subscription);
  if (mismatchStatus !== "stripe-accounts-exist-correctly") return;
  switch (type) {
    case "old-price-id":
      return;
    case "accessPass":
      await updateOrCreateAccessPass(
        subscription,
        stripeAccount as InstitutionStripeAccount,
      );
      break;
    case "addOn":
      await updateOrCreatePaidAddOn(subscription, prisma);
      break;
    case "storage":
      await createOrUpdateStorageSubscription({ stripeAccount, subscription });
      break;
    case "stripeAccount":
      if (
        subscription.status !== "incomplete_expired" &&
        subscription.status !== "incomplete"
      ) {
        await updateInstitutionStripeAccount({
          customerId,
          institutionId,
          subscription,
        });
      }
      break;
  }
};

export const handleSubscriptionCanceled = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const {
    subscription,
    customerId,
    stripeAccount,
    mismatchStatus,
    institutionId,
  } = await checkCustomerAndAccountExists({ event, prisma });
  const type = getSubscriptionType(subscription);
  if (mismatchStatus !== "stripe-accounts-exist-correctly") return;
  switch (type) {
    case "old-price-id":
      return;
    case "addOn":
      await updateOrCreatePaidAddOn(subscription, prisma);
      break;
    case "accessPass":
      await cancelAccessPass(
        subscription,
        stripeAccount as InstitutionStripeAccount,
      );
      break;
    case "storage":
      await createOrUpdateStorageSubscription({ stripeAccount, subscription });
      break;
    case "stripeAccount":
      await updateInstitutionStripeAccount({
        customerId,
        institutionId,
        subscription,
      });
      break;
  }
};

const updateInstitutionStripeAccount = async ({
  customerId,
  institutionId,
  subscription,
}: {
  customerId: string;
  institutionId: string;
  subscription: Stripe.Subscription;
}) => {
  if (subscription.metadata.noLongerUsed !== "true") {
    await updateOldSubscriptionToNoLongerUsed(institutionId, subscription.id);
    await prisma.institutionStripeAccount.update({
      where: {
        customerId: customerId,
      },
      data: {
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
      },
    });
    await cacheRedisHandler.invalidate.custom({
      prefix: "user-data",
      searchParam: subscription.metadata.institutionId as string,
      type: "single",
      origin:
        "server-stripe/webhook-handlers.ts (updateInstitutionStripeAccount)",
    });
  }
};

export const paidAddOnExistsAlready = (
  paidAddOns: PaidAddOn[],
  subscription: Stripe.Subscription,
) => {
  const addOn = paidAddOns.find(
    (addOn) => addOn.addOnPriceId === subscription.items.data[0]?.price.id,
  );
  return addOn ? true : false;
};

export const updateOrCreatePaidAddOn = async (
  subscription: Stripe.Subscription,
  prisma: PrismaClient,
) => {
  const institutionId = subscription.metadata.institutionId as string;
  const stripeAccount = await getInstitutionStripeAccount(institutionId);
  const paidAddOns = await getPaidAddOnsOfInstitution(institutionId);
  if (
    stripeAccount &&
    paidAddOns &&
    !paidAddOnExistsAlready(paidAddOns, subscription) &&
    subscription.items.data[0]?.price
  ) {
    createNewAddOn(subscription, stripeAccount);
  } else if (
    stripeAccount &&
    paidAddOns &&
    paidAddOnExistsAlready(paidAddOns, subscription) &&
    subscription.items.data[0]?.price
  ) {
    updateAddOn(subscription, stripeAccount);
  } else if (
    !stripeAccount &&
    subscription.id &&
    subscription.status &&
    institutionId &&
    subscription.items.data[0]?.price.id
  ) {
    createNewStripeAccountAndPaidAddOn(institutionId, subscription);
  }
};

export const updateOrCreateAccessPass = async (
  subscription: Stripe.Subscription,
  stripeAccount: InstitutionStripeAccount,
) => {
  const institutionId = subscription.metadata.institutionId as string;
  const accessPasses = await getAccessPassesOfInstitution(institutionId);
  if (
    stripeAccount &&
    accessPasses &&
    accessPassExistsAlready(accessPasses, subscription) &&
    subscription.items.data[0]?.price
  ) {
    updateAccessPassAndAddCancellation(subscription, stripeAccount);
  } else if (
    !stripeAccount &&
    subscription.id &&
    subscription.status &&
    institutionId &&
    subscription.items.data[0]?.price.id
  ) {
    createNewStripeAccountAndUpdateAccessPass(institutionId, subscription);
  }
};

export const updateConnectAccount = async (acc: Stripe.Account) => {
  let res;
  try {
    res = await prisma.institutionStripeAccount.update({
      where: {
        institutionId: acc.metadata?.institutionId as string,
      },
      data: {
        connectAccountEnabled: acc.charges_enabled,
      },
    });
  } catch (e) {
    console.error("error updating connect acnt", e);
  }
};
