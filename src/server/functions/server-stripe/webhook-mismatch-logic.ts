import type { InstitutionStripeAccount, PrismaClient } from "@prisma/client";
import type Stripe from "stripe";
import type { MismatchStatus } from "@/src/utils/stripe-types";
import { prisma } from "../../db/client";
import { isCustomer } from "./utils";

export const checkCustomerAndAccountExists = async ({
  event,
  prisma,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const institutionId = subscription.metadata.institutionId as string;
  const customer = subscription.customer;
  const customerId = isCustomer(customer) ? customer.id : (customer as string);
  if (institutionId) {
    const [stripeAccount, stripeAccountWithCorrectCustomerId] =
      await Promise.all([
        institutionId
          ? prisma.institutionStripeAccount.findUnique({
              where: {
                institutionId: institutionId,
              },
            })
          : null,
        customerId
          ? prisma.institutionStripeAccount.findUnique({
              where: {
                customerId: customerId,
              },
            })
          : null,
      ]);
    const mismatchStatus = await handleStripeAccountMismatches({
      stripeAccount,
      stripeAccountWithCorrectCustomerId,
      customerId,
      subscription,
    });
    return {
      stripeAccount,
      stripeAccountWithCorrectCustomerId,
      customerId,
      institutionId,
      subscription,
      mismatchStatus,
    };
  } else
    throw new Error(
      "Subscription doesn't have institutionId: " + JSON.stringify(event),
    );
};

export const handleStripeAccountMismatches = async ({
  stripeAccount,
  stripeAccountWithCorrectCustomerId,
  subscription,
}: {
  stripeAccount?: InstitutionStripeAccount | null;
  stripeAccountWithCorrectCustomerId?: InstitutionStripeAccount | null;
  customerId: string;
  subscription: Stripe.Subscription;
}): Promise<MismatchStatus> => {
  if (stripeAccount && stripeAccountWithCorrectCustomerId) {
    if (stripeAccount.id === stripeAccountWithCorrectCustomerId.id) {
      return "stripe-accounts-exist-correctly";
    } else {
      return handleStripeAccountIdMismatch(subscription);
    }
  } else if (stripeAccount && !stripeAccountWithCorrectCustomerId) {
    // This should only happen if the customer was no longer used because its a test institution.
    return "only-normal-stripe-account-exists";
  } else {
    return await handleNoStripeAccount(subscription);
  }
};

export const handleStripeAccountIdMismatch = async (
  subscription: Stripe.Subscription,
) => {
  const institution = await prisma.institution.findUnique({
    where: { id: subscription.metadata.institutionId as string },
  });
  throw new Error(
    "Stripe Account found from institutionId and Stripe Account found from Customer Id Do not Match" +
      ", institution:" +
      JSON.stringify(institution),
  );
};

export const handleNoStripeAccount = async (
  subscription: Stripe.Subscription,
): Promise<MismatchStatus> => {
  const institution = await prisma.institution.findUnique({
    where: { id: subscription.metadata.institutionId as string },
  });
  if (institution) {
    // This has to throw an error, so that we do not miss the case where a customer is not created correctly.
    throw new Error(
      "Institution should have had a stripe account already" +
        ",institution:" +
        JSON.stringify(institution),
    );
    // If the institution also doesn't exist, we do not care
  } else return "institution-doesnt-exist";
};
