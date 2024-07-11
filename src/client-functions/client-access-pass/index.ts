import { track } from "@vercel/analytics";
import type Stripe from "stripe";
import { useAccessPassEditor } from "@/src/components/institution-settings/setting-containers/insti-settings-access-passes/table/access-pass-editor/zustand";
import { useTaxRates } from "@/src/components/institution-settings/setting-containers/insti-settings-access-passes/tax-rates/zustand";
import { useAccessPasses } from "@/src/components/institution-settings/setting-containers/insti-settings-access-passes/zustand";
import api from "@/src/pages/api/api";
import type {
  AccessPassIdData,
  AccessPassStatusInfo,
  AccessPassWithPaymentInfo,
  CreateAccessPassData,
  CreateAccessPassSubscriptionData,
  UpdateAccessPassData,
} from "@/src/utils/stripe-types";
import { isCreateOrUpdateAccessPassEnabled } from "../client-paid-access-pass/utils";
import { stripeReq } from "../client-stripe/request-manager";

export const createAccessPassSubscription = async (
  data: CreateAccessPassSubscriptionData,
) => {
  track("Creating access pass subscription");
  return await stripeReq<CreateAccessPassSubscriptionData>({
    data,
    method: "POST",
    route: api.createAccessPassSubscription,
    errorMessage: "Failed to create your access pass subscription",
    alertError: true,
  });
};
export const createAccessPass = async (data: CreateAccessPassData) => {
  track("Creating access pass");
  return await stripeReq<CreateAccessPassData>({
    data,
    method: "POST",
    route: api.createAccessPass,
    errorMessage: "Failed to create your access pass",
    alertError: true,
  });
};

export const getAccessPassStatusInfos = async (): Promise<
  AccessPassStatusInfo[]
> => {
  const unorderedInfos = await stripeReq({
    data: null,
    method: "GET",
    route: api.getAccessPassStatusInfos,
    errorMessage: "Failed to Connect to Payment Provider.",
  });
  if (!unorderedInfos || unorderedInfos.length === 0) return [];
  const orderedInfos = unorderedInfos.sort((a, b) => {
    const aDate: Date = new Date(a.accessPass.createdAt);
    const bDate: Date = new Date(b.accessPass.createdAt);
    return bDate.getTime() - aDate.getTime();
  });
  return orderedInfos;
};

export const deleteAccessPass = async (data: AccessPassIdData) => {
  return await stripeReq<AccessPassIdData>({
    data,
    method: "POST",
    route: api.deleteAccessPass,
    errorMessage: "Failed to delete your access pass",
    alertError: true,
  });
};

export const getAndSetAccessPassStatusInfos = async (
  setLoading?: (loading: boolean) => void,
): Promise<AccessPassStatusInfo[]> => {
  const { setAccessPassStatusInfos } = useAccessPasses.getState();
  const infos = await getAccessPassStatusInfos();
  setAccessPassStatusInfos(infos);
  setLoading && setLoading(false);
  return infos;
};

export const handleUpdateAccessPass = async (
  accessPass: AccessPassWithPaymentInfo,
  setOpen: (open: boolean) => void,
) => {
  const {
    withMemberLimit,
    description,
    maxUsers,
    currency,
    priceForUser,
    taxRate,
    isPaid,
    name,
  } = useAccessPassEditor.getState();

  const unitAmount = priceForUser ? Math.round(priceForUser * 100) : 0;
  if (
    isCreateOrUpdateAccessPassEnabled("update", {
      name,
      description,
      isPaid,
      priceForUser,
      maxUsers,
      withMemberLimit,
      taxRate,
    })
  ) {
    const data: UpdateAccessPassData = {
      ...(isPaid
        ? {
            productAndPriceInfo: {
              currency: currency === "$" ? "usd" : "eur",
              unitAmount,
              description,
              taxRateId: (taxRate as Stripe.TaxRate).id,
              name,
            },
          }
        : {}),
      accessPass,
      isPaid,
      maxUsers: withMemberLimit ? maxUsers! : null,
    };
    await updateAccessPass(data);
    await getAndSetAccessPassStatusInfos();
    setOpen(false);
  }
};

export const updateAccessPass = async (data: UpdateAccessPassData) => {
  return await stripeReq<UpdateAccessPassData>({
    data,
    method: "POST",
    route: api.updateAccessPass,
    errorMessage: "Failed to update your access pass",
    alertError: true,
  });
};

export const initAccessPassEditor = (accessPass: AccessPassWithPaymentInfo) => {
  const { taxRates } = useTaxRates.getState();
  const {
    setMaxUsers,
    setWithMemberLimit,
    setTaxRate,
    setPriceForUser,
    setDescription,
    setCurrency,
    setIsPaid,
    setName,
  } = useAccessPassEditor.getState();
  setMaxUsers(accessPass.maxUsers || undefined);
  setWithMemberLimit(accessPass.maxUsers ? true : false);
  if (accessPass.isPaid && accessPass.accessPassPaymentInfo) {
    const { taxRateId, unitAmount, description, currency, name } =
      accessPass.accessPassPaymentInfo;
    name && setName(name);
    setTaxRate(taxRates.find((taxRate) => taxRate.id === taxRateId));
    setPriceForUser((unitAmount / 100).toFixed(2) as unknown as number);
    setDescription(description);
    setCurrency(currency === "usd" ? "$" : "€");
    setIsPaid(accessPass.isPaid);
  } else {
    setTaxRate(undefined);
    setPriceForUser(undefined);
    setDescription("");
    setCurrency("$");
    setIsPaid(false);
    setName("");
  }
};
