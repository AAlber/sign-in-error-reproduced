import api from "@/src/pages/api/api";
import type { BasicAccountInfo } from "@/src/utils/stripe-types";
import { stripeReq } from "../client-stripe/request-manager";

export const getStripeConnectAccount = async (): Promise<
  Readonly<BasicAccountInfo>
> => {
  return await stripeReq({
    data: null,
    method: "GET",
    route: api.getStripeConnectAccount,
    errorMessage: "Failed to get stripe connect account",
    alertError: false,
  });
};

export const createStripeConnectAccount = async () => {
  return await stripeReq({
    data: null,
    method: "POST",
    route: api.createStripeConnectAccount,
    errorMessage: "Failed to create your access pass",
    alertError: true,
  });
};
