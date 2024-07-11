import type Stripe from "stripe";
import { useAccessPassCreator } from "@/src/components/institution-settings/setting-containers/insti-settings-access-passes/add-access-pass-modal/zustand";
import { useTaxRates } from "@/src/components/institution-settings/setting-containers/insti-settings-access-passes/tax-rates/zustand";
import api from "@/src/pages/api/api";
import type {
  CreateTaxRateData,
  UpdateTaxRateData,
} from "@/src/utils/stripe-types";
import { stripeReq } from "../../client-stripe/request-manager";
import {
  getCountryCodeByName,
  isCreateTaxRateAllowed,
  taxTypeJson,
} from "./utils";

export const createTaxRate = async (data: CreateTaxRateData) => {
  return await stripeReq<CreateTaxRateData>({
    data,
    method: "POST",
    route: api.createTaxRate,
    errorMessage: "Failed to create tax rate.",
    alertError: true,
  });
};

export const updateTaxRate = async (data: UpdateTaxRateData) => {
  return await stripeReq<UpdateTaxRateData>({
    data,
    method: "POST",
    route: api.updateTaxRate,
    errorMessage: "Failed to update tax rate.",
    alertError: true,
  });
};

export const getAllTaxRates = async (): Promise<Stripe.TaxRate[]> => {
  const res: Promise<Stripe.ApiListPromise<Stripe.TaxRate>> = await stripeReq({
    data: null,
    method: "GET",
    route: api.getAllTaxRates,
    errorMessage: "Failed to list all tax rates.",
    alertError: true,
  });
  return (await res).data;
};

export async function handleTaxRateSubmit(setOpen: (open: boolean) => void) {
  const {
    selectedCountry,
    selectedInclusiveTax,
    selectedTaxType,
    taxRatePercentage,
    customDisplayName,
    setTaxRates,
  } = useTaxRates.getState();

  const { setTaxRate } = useAccessPassCreator.getState();
  if (isCreateTaxRateAllowed()) {
    const data: CreateTaxRateData = {
      displayName:
        selectedTaxType === "tax_rate.custom"
          ? customDisplayName
          : selectedTaxType,
      inclusive: selectedInclusiveTax,
      percentage: Number(taxRatePercentage),
      type: taxTypeJson[selectedTaxType] as Stripe.TaxRateCreateParams.TaxType,
      country: getCountryCodeByName(selectedCountry) as string,
    };
    await createTaxRate(data);
    const taxRates = await getAllTaxRates();
    setTaxRates(taxRates);
    setTaxRate(taxRates[0]);
    setOpen(false);
  }
}
