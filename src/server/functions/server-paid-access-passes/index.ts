import type {
  AccessPassPaymentInfo,
  InstitutionStripeAccount,
} from "@prisma/client";
import { env } from "process";
import type Stripe from "stripe";
import { SettingId } from "@/src/components/institution-settings/tabs";
import type {
  CreateUserCheckoutSessionData,
  ProductAndPriceInfo,
  UpdateAccessPassData,
} from "@/src/utils/stripe-types";
import { prisma } from "../../db/client";
import { stripe } from "../../singletons/stripe";
import {
  addConnectAccountId,
  createValidatorToken,
  getConnectAccountId,
  getOrCreateUserStripeAccount,
  getStripeConnectAccountId,
} from "./db-requests";

export const createStripeConnectAccount = async (
  stripeAccount: InstitutionStripeAccount,
  data?: { userId: string },
): Promise<string> => {
  let accountId = await getConnectAccountId(stripeAccount.id);
  if (!accountId) {
    accountId = (
      await stripe.accounts.create({
        type: "standard",
        metadata: {
          institutionId: stripeAccount.institutionId,
        },
        settings: {},
      })
    ).id;
    await addConnectAccountId(stripeAccount.id, accountId);
  }
  const accountLink = await createAccountLink(
    accountId,
    data?.userId as string,
  );
  return accountLink.url;
};

export const createAccountLink = async (accountId: string, userId: string) => {
  return await stripe.accountLinks.create({
    account: accountId,
    //TODO: Need to add proper links here
    refresh_url: env.SERVER_URL + "/refresh",
    return_url:
      env.SERVER_URL +
      `?page=ORGANIZATION_SETTINGS&tab=${
        SettingId.AccessPasses
      }&connectAccountCreated=${true}`,
    type: "account_onboarding",
  });
};

export const createPrice = async ({
  unitAmount,
  currency,
  productId,
  connectedAccountId,
}: {
  unitAmount: number;
  currency: string;
  productId: string;
  connectedAccountId: string;
}): Promise<Stripe.Price> => {
  const price = await stripe.prices.create(
    {
      product: productId,
      unit_amount: unitAmount,
      currency,
    },
    {
      stripeAccount: connectedAccountId,
    },
  );
  return price;
};

export const createProduct = async ({
  productName,
  description,
  connectedAccountId,
}: {
  productName: string;
  description: string;
  connectedAccountId: string;
}): Promise<Stripe.Product> => {
  const product = await stripe.products.create(
    {
      name: productName,
      description,
    },
    {
      stripeAccount: connectedAccountId,
    },
  );
  return product;
};

export const createProductAndPrice = async ({
  info,
  productName,
  connectedAccountId,
}: {
  info: ProductAndPriceInfo;
  productName: string;
  connectedAccountId: string;
}): Promise<{ priceId: string; productId: string }> => {
  const { description, currency, unitAmount } = info;
  const product = await createProduct({
    productName,
    description,
    connectedAccountId,
  });
  const price = await createPrice({
    unitAmount,
    currency,
    productId: product.id,
    connectedAccountId,
  });
  return { priceId: price.id, productId: product.id };
};

export const updateProductAndPrice = async ({
  data,
  connectedAccountId,
}: {
  data?: UpdateAccessPassData;
  connectedAccountId: string;
}): Promise<{ priceId: string; productId: string }> => {
  const { accessPass } = data as UpdateAccessPassData;
  const { productId } =
    accessPass.accessPassPaymentInfo as AccessPassPaymentInfo;
  const { description, currency, unitAmount, name } =
    data?.productAndPriceInfo as ProductAndPriceInfo;
  const product = await updateProduct({
    productId,
    productName: name,
    description,
    connectedAccountId,
  });
  const price = await createPrice({
    unitAmount,
    currency,
    productId: product.id,
    connectedAccountId,
  });
  return { priceId: price.id, productId: product.id };
};

export const updateProduct = async ({
  productId,
  productName,
  description,
  connectedAccountId,
}: {
  productId: string;
  productName: string;
  description: string;
  connectedAccountId: string;
}) => {
  return await stripe.products.update(
    productId,
    {
      description,
      name: productName,
    },
    {
      stripeAccount: connectedAccountId,
    },
  );
};

export const getUserCheckoutSessionData = async ({
  invite,
  userId,
}: CreateUserCheckoutSessionData) => {
  const connectedAccountId = await getStripeConnectAccountId(
    invite.institution_id,
  );
  if (!connectedAccountId) throw new Error("No connected account found");
  const [validatorToken, userStripeAccount] = await Promise.all([
    createValidatorToken(invite, userId),
    getOrCreateUserStripeAccount(userId, connectedAccountId),
  ]);

  const customerId = userStripeAccount.customerId;
  const info = invite.accessPass?.accessPassPaymentInfo;
  if (!info) throw new Error("No payment info found");
  const { stripePriceId, taxRateId } = info;
  const roundedApplicationFee = Math.round(info?.unitAmount * 0.005);
  const successUrl = `${process.env.SERVER_URL}/process-invitation/${invite.target}/${invite.token}/${validatorToken}`;
  const cancelUrl = `${process.env.SERVER_URL}/process-invitation/${invite.target}/${invite.token}/delete-${validatorToken}`;
  return {
    connectedAccountId,
    successUrl,
    roundedApplicationFee,
    customerId,
    stripePriceId,
    cancelUrl,
    taxRateId,
  };
};

export const createUserCheckoutSession = async ({
  invite,
  userId,
}: CreateUserCheckoutSessionData) => {
  const {
    connectedAccountId,
    customerId,
    roundedApplicationFee,
    stripePriceId,
    successUrl,
    cancelUrl,
    taxRateId,
  } = await getUserCheckoutSessionData({ invite, userId });

  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      customer: customerId,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
          tax_rates: [taxRateId],
        },
      ],
      customer_update: {
        name: "auto",
        address: "auto",
      },
      invoice_creation: {
        enabled: true,
      },
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: {
        institutionId: invite.institution_id,
        userId,
      },
      payment_intent_data: {
        application_fee_amount: roundedApplicationFee,
        setup_future_usage: "off_session",
      },
      saved_payment_method_options: {
        payment_method_save: "enabled",
        allow_redisplay_filters: ["always"],
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    },
    { stripeAccount: connectedAccountId },
  );
  return session.url;
};

export async function getInvoicesOfUser({
  userId,
  institutionId,
}: {
  userId: string;
  institutionId?: string;
}) {
  const connectedAccountId =
    institutionId && (await getStripeConnectAccountId(institutionId));
  if (!connectedAccountId && institutionId) return [];
  const userStripeAccounts = await prisma.userStripeAccount.findMany({
    where: {
      userId: userId,
      connectedAccountId: connectedAccountId ?? undefined,
    },
  });
  const result = userStripeAccounts.map(async (userStripeAccount) => {
    const customerId = userStripeAccount.customerId;
    if (!customerId || !userStripeAccount.connectedAccountId) return [];
    const invoices = await stripe.invoices.list(
      {
        customer: customerId,
        limit: 20,
      },
      {
        stripeAccount: userStripeAccount.connectedAccountId,
      },
    );
    return invoices.data;
  });
  const res = await Promise.all(result);
  return res.flat();
}
