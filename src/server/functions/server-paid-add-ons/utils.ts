import type { PaidAddOn } from "@prisma/client";

export const getCorrectAddOn = (addOns: PaidAddOn[], priceId: string) => {
  return addOns.find((addOn) => addOn.addOnPriceId === priceId);
};
