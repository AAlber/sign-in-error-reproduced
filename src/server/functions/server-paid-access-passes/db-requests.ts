import type {
  InstitutionStripeAccount,
  UserStripeAccount,
} from "@prisma/client";
import * as Sentry from "@sentry/nextjs";
import cuid from "cuid";
import type Stripe from "stripe";
import type { InviteError } from "@/src/types/invite.types";
import type {
  InviteWithPaidAccessPass,
  ProductAndPriceInfo,
} from "@/src/utils/stripe-types";
import { prisma } from "../../db/client";
import { stripe } from "../../singletons/stripe";
import { createProductAndPrice } from "./index";

export const addConnectAccountId = async (
  stripeAccountId: string,
  connectAccountId: string,
) => {
  const res = await prisma.institutionStripeAccount.update({
    where: {
      id: stripeAccountId,
    },
    data: {
      connectAccountId,
    },
  });
  return res;
};

export const getConnectAccountId = async (stripeAccountId: string) => {
  const res = await prisma.institutionStripeAccount.findUnique({
    where: {
      id: stripeAccountId,
    },
  });
  return res?.connectAccountId;
};

export const getUserStripeAccount = async (
  userId: string,
  connectedAccountId,
): Promise<UserStripeAccount | undefined> => {
  const res = await prisma.userStripeAccount.findMany({
    where: {
      userId,
      connectedAccountId,
    },
  });
  if (res.length > 1) throw new Error("More than one userStripeAccount found");
  if (res.length === 0) return undefined;
  return res[0];
};

export const createUserStripeAccount = async (
  userId: string,
  connectedAccountId: string,
): Promise<UserStripeAccount> => {
  const stripeCustomer = await stripe.customers.create(
    {
      metadata: {
        userId,
        userStripeAccount: "true",
      },
    },
    {
      stripeAccount: connectedAccountId,
    },
  );

  const stripeAccount = await prisma.userStripeAccount.create({
    data: {
      userId,
      customerId: stripeCustomer.id,
      connectedAccountId,
    },
  });
  return stripeAccount;
};

export const getOrCreateUserStripeAccount = async (
  userId: string,
  connectedAccountId: string,
): Promise<UserStripeAccount> => {
  const res = await getUserStripeAccount(userId, connectedAccountId);
  if (res) return res;
  else return await createUserStripeAccount(userId, connectedAccountId);
};

export const updatePrice = async ({
  unitAmount,
  currency,
  accessPassId,
  stripePriceId,
  description,
}: {
  unitAmount: number;
  currency: string;
  accessPassId: string;
  description: string;
  stripePriceId: string;
}) => {
  return await prisma.accessPass.update({
    where: {
      id: accessPassId,
    },
    data: {
      accessPassPaymentInfo: {
        update: {
          unitAmount,
          currency,
          description,
          stripePriceId,
        },
      },
    },
  });
};

export const createValidatorToken = async (
  invite: InviteWithPaidAccessPass,
  userId: string,
) => {
  if (invite.accessPass?.accessPassPaymentInfoId) {
    const token = cuid();
    await prisma.accessPassPaymentInfo.update({
      where: {
        id: invite.accessPass.accessPassPaymentInfoId,
      },
      data: {
        accessPassTokens: {
          create: {
            id: token,
            userId,
          },
        },
      },
    });
    return token;
  } else throw new Error("Missing accessPassPaymentInfoId");
};

export const deleteValidatorToken = async ({
  userId,
  token,
}: {
  userId: string;
  token: string;
}) => {
  try {
    const res = await prisma.accessPassToken.findMany({
      where: {
        id: token,
        userId: userId,
      },
    });
    if (res.length === 0) throw new Error("no-token-to-delete");
    await prisma.accessPassToken.delete({
      where: {
        id: token,
      },
    });
    return res;
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);
    throw new Error("couldnt-delete-token");
  }
};

export const getValidatedAccessPassTokenOrDeleteOld = async ({
  userId,
  token,
  accessPassPaymentInfoId,
}: {
  userId: string;
  token: string;
  accessPassPaymentInfoId: string | null;
}): Promise<string | undefined> => {
  const accessPassToken = await prisma.accessPassToken.findUnique({
    where: {
      id: token,
    },
  });
  if (token.startsWith("delete-")) {
    await deleteValidatorToken({ userId, token: token.replace("delete-", "") });
    throw new Error(
      "exited-payment-portal-without-paying" satisfies InviteError,
    );
  }
  if (
    accessPassToken?.userId == userId &&
    accessPassPaymentInfoId === accessPassToken?.accessPassPaymentInfoId
  ) {
    return accessPassToken?.id;
  }
};

export const getStripeConnectAccount = async (
  stripeAccount: InstitutionStripeAccount,
) => {
  const id = stripeAccount.connectAccountId;
  const enabled = stripeAccount.connectAccountEnabled;
  const res: Stripe.Account = await stripe.accounts.retrieve(id!);
  return { id, enabled, res };
};

export const getStripeConnectAccountId = async (institutionId: string) => {
  const res = await prisma.institutionStripeAccount.findUnique({
    where: {
      institutionId,
    },
  });
  return res?.connectAccountId;
};

export const addAccessPassPaymentInfo = async ({
  accessPassId,
  info,
  connectedAccountId,
}: {
  accessPassId: string;
  info: ProductAndPriceInfo;
  connectedAccountId: string;
}) => {
  const { currency, unitAmount, taxRateId, description, name } = info;
  const { priceId, productId } = await createProductAndPrice({
    info,
    productName: info.name,
    connectedAccountId,
  });
  return await prisma.accessPass.update({
    where: { id: accessPassId },
    data: {
      isPaid: true,
      accessPassPaymentInfo: {
        create: {
          unitAmount,
          currency,
          productId,
          description,
          stripePriceId: priceId,
          taxRateId,
          name,
          accessPassId,
        },
      },
    },
  });
};
