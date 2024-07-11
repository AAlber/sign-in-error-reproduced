export enum PricingModel {
  Two_Weeks_Trial = "price_1OIRpaEwHpTUe8W7zWHnSGDq",
  Small_Yearly = "price_1NFxsPEwHpTUe8W7ZHz35bDZ",
  Small_Monthly = "price_1NFxumEwHpTUe8W7ylkfurKF",
  Mid_Yearly = "price_1NFxtaEwHpTUe8W7EIOsYHth",
  Mid_Monthly = "price_1NFxv6EwHpTUe8W7rUCbNM1c",
  Large_Yearly = "price_1NFxuOEwHpTUe8W7d4SK9P54",
  Large_Monthly = "price_1NFxveEwHpTUe8W7CKekLYfv",
}
export enum PricingModelProd {
  Two_Weeks_Trial = "price_1OISTjEwHpTUe8W7br5dBw0D",
  Small_Yearly = "price_1NH6biEwHpTUe8W70yZWvsJ9",
  Small_Monthly = "price_1NH6bUEwHpTUe8W7TvUQfDKg",
  Mid_Yearly = "price_1NH6beEwHpTUe8W7UmFnlHBA",
  Mid_Monthly = "price_1NH6bQEwHpTUe8W7UY0uM4vc",
  Large_Yearly = "price_1NH6bZEwHpTUe8W7Q2huSV79",
  Large_Monthly = "price_1NH6bKEwHpTUe8W7l5VlNQU1",
}

export enum DevSupportPackages {
  None = "none",
  Standard_Support = "price_1OJZecEwHpTUe8W7FYurgN3u",
  Professional_Support = "price_1OJZfCEwHpTUe8W7gQaqzhzN",
  Premium_Support = "price_1OJZfmEwHpTUe8W7RgxtDsVd",
  Exclusive_Support = "price_1OJcctEwHpTUe8W7SenmhTeX",
}

export enum ProdSupportPackages {
  None = "none",
  Standard_Support = "price_1OJYnhEwHpTUe8W7GrBXzPAe",
  Professional_Support = "price_1OJcdyEwHpTUe8W7R4vorgQL",
  Premium_Support = "price_1OJcedEwHpTUe8W7d4oXVkou",
  Exclusive_Support = "price_1OJceiEwHpTUe8W7eWGWAblH",
}

export type SupportPackages = DevSupportPackages | ProdSupportPackages;

export enum AccessPassPricesProd {
  One_Day = "price_1NaEhYEwHpTUe8W7sJKXhzGZ",
  Three_Days = "price_1NaEhrEwHpTUe8W7ZNxDBfS9",
  One_Week = "price_1NaEi5EwHpTUe8W7kx5vp5sZ",
  Two_Weeks = "price_1NaEiHEwHpTUe8W7BTw6zWc9",
  One_Month = "price_1NaEj0EwHpTUe8W711eTFJ8n",
  Two_Months = "price_1NaEjIEwHpTUe8W7ZAFvGBc9",
  Three_Months = "price_1NZq5tEwHpTUe8W7yUaPYHMX",
  Four_Months = "price_1NaEjhEwHpTUe8W7BpD80pyP",
  Five_Months = "price_1NaEjvEwHpTUe8W7uER4L3jN",
  Six_Months = "price_1NaEk9EwHpTUe8W7TfdjwgpD",
}
export enum AccessPassPrices {
  One_Day = "price_1NYw9AEwHpTUe8W7TCEKdMkp",
  Three_Days = "price_1NYwI6EwHpTUe8W7YbhtO1B0",
  One_Week = "price_1NYwJfEwHpTUe8W75M4iNAH1",
  Two_Weeks = "price_1NYwKuEwHpTUe8W7F2AResDW",
  One_Month = "price_1NYwN5EwHpTUe8W7cp6PukCd",
  Two_Months = "price_1NYwTIEwHpTUe8W7t8C6tknV",
  Three_Months = "price_1NYwZyEwHpTUe8W7R7pEVuOo",
  Four_Months = "price_1NaEdDEwHpTUe8W7rQ6wcPiK",
  Five_Months = "price_1NaEeLEwHpTUe8W7VR9uAMhO",
  Six_Months = "price_1NaEf2EwHpTUe8W7qVAWiGlO",
}

export function getPricingInterval(
  priceId: string,
): "yearly" | "monthly" | null {
  const pricingMap = new Map<string, "yearly" | "monthly">([
    [Small_Yearly, "yearly"],
    [Small_Monthly, "monthly"],
    [Mid_Yearly, "yearly"],
    [Mid_Monthly, "monthly"],
    [Large_Yearly, "yearly"],
    [Large_Monthly, "monthly"],
  ]);
  return pricingMap.get(priceId) || null;
}

const isProductionEnvironment =
  process.env.NEXT_PUBLIC_SERVER_URL === "https://fuxam.app/";
export const SELECT_ENVIRONMENT_HERE: "prod" | "dev" = isProductionEnvironment
  ? "prod"
  : "dev";

const getProductionOrDevVars = (whichONE: "prod" | "dev") => {
  if ("prod" === whichONE) {
    return {
      pricingModel: PricingModelProd,
      taxRate: "txr_1NOL6fEwHpTUe8W73PbPpAfX",
      accessPassPrices: AccessPassPricesProd,
      supportPackages: ProdSupportPackages,
      additionalStorage: "price_1PNdN8EwHpTUe8W7YLwzEJsS",
    };
  } else {
    return {
      pricingModel: PricingModel,
      taxRate: "txr_1NOM6XEwHpTUe8W7TMsYhox7",
      accessPassPrices: AccessPassPrices,
      supportPackages: DevSupportPackages,
      additionalStorage: "price_1PNdM5EwHpTUe8W7WGeSbfHL",
    };
  }
};

export const {
  pricingModel,
  taxRate,
  accessPassPrices,
  supportPackages,
  additionalStorage,
} = getProductionOrDevVars(SELECT_ENVIRONMENT_HERE);

export const {
  Exclusive_Support,
  Premium_Support,
  Professional_Support,
  Standard_Support,
  None,
} = supportPackages;

export const {
  Two_Weeks_Trial,
  Large_Monthly,
  Large_Yearly,
  Mid_Monthly,
  Mid_Yearly,
  Small_Monthly,
  Small_Yearly,
} = pricingModel;

export const {
  One_Day,
  Three_Days,
  One_Week,
  Two_Weeks,
  One_Month,
  Two_Months,
  Three_Months,
  Four_Months,
  Five_Months,
  Six_Months,
} = accessPassPrices;

export const accessPassPriceArray = [
  One_Day,
  Three_Days,
  One_Week,
  Two_Weeks,
  One_Month,
  Two_Months,
  Three_Months,
  Four_Months,
  Five_Months,
  Six_Months,
];

export const standardPlanPriceIds: string[] = [
  Large_Monthly,
  Large_Yearly,
  Mid_Monthly,
  Mid_Yearly,
  Small_Monthly,
  Small_Yearly,
  Two_Weeks_Trial,
];

export const supportPackageArray: SupportPackages[] = [
  None,
  Standard_Support,
  Professional_Support,
  Premium_Support,
  Exclusive_Support,
];

function createReverseMapping(enumObj: any): { [id: string]: string } {
  const reverseMap: { [id: string]: string } = {};
  for (const key of Object.keys(enumObj)) {
    reverseMap[enumObj[key]] = key;
  }
  return reverseMap;
}

const reverseDevSupportPackages = createReverseMapping(DevSupportPackages);
const reverseProdSupportPackages = createReverseMapping(ProdSupportPackages);

export function getSupportPackageNameFromValue(
  value: string,
): string | undefined {
  const res =
    reverseDevSupportPackages[value] ||
    reverseProdSupportPackages[value] ||
    "None";
  return res?.replace(/_/g, " ");
}

interface SupportPackageInfo {
  priceId: string;
  formattedPrice: string;
  shortDescription: string;
  featureList: SupportFeatureList[];
}
interface SupportFeatureList {
  title: string;
  duration: string;
}

const packageDetails: SupportPackageInfo[] = [
  {
    priceId: "none",
    formattedPrice: "0",
    shortDescription: "none_support_description",
    featureList: [
      {
        title: "none_support_description",
        duration: "",
      },
    ],
  },
  {
    priceId: Standard_Support,
    formattedPrice: "99.00",
    shortDescription: "standard_support_description",
    featureList: [
      {
        title: "standard_support_feature_1",
        duration: "standard_support_feature_1_duration",
      },
      {
        title: "kick-off-call",
        duration: "1-hour",
      },
    ],
  },
  {
    priceId: Professional_Support,
    formattedPrice: "299.00",
    shortDescription: "professional_support_description",
    featureList: [
      {
        title: "standard_support_feature_1",
        duration: "standard_support_feature_1_duration",
      },
      {
        title: "contact_person_for_admin",
        duration: "professional_support_feature_3_duration",
      },
      {
        title: "kick-off-call",
        duration: "1-hour",
      },
      {
        title: "system-optimization-call",
        duration: "1-hour",
      },
    ],
  },

  {
    priceId: Premium_Support,
    formattedPrice: "599.00",
    shortDescription: "premium_support_description",
    featureList: [
      {
        title: "standard_support_feature_1",
        duration: "standard_support_feature_1_duration",
      },
      {
        title: "contact_person_for_admin",
        duration: "premium_support_feature_3_duration",
      },
      {
        title: "kick-off-call",
        duration: "1-hour",
      },
      {
        title: "system-optimization-call",
        duration: "premium_support_feature_2_duration",
      },
    ],
  },
  {
    priceId: Exclusive_Support,
    formattedPrice: "2,499.00",
    shortDescription: "exclusive_support_description",
    featureList: [
      {
        title: "standard_support_feature_1",
        duration: "standard_support_feature_1_duration",
      },
      {
        title: "exclusive_support_feature_1",
        duration: "one_year",
      },
      {
        title: "exclusive_support_feature_2",
        duration: "one_year",
      },
      {
        title: "exclusive_support_feature_3",
        duration: "one_year",
      },
    ],
  },
];

export const isMonthlyPriceId = (priceId?: string | null) => {
  if (!priceId) return true;
  const pricingModels = [Large_Monthly, Mid_Monthly, Small_Monthly];
  if (pricingModels.includes(priceId as PricingModel)) {
    return true;
  }
  return false;
};

export function getSupportPackageInfo(
  priceId: string,
): SupportPackageInfo | undefined {
  return packageDetails.find(
    (packageDetail) => packageDetail.priceId === priceId,
  );
}
export function getPricingModel(userAmount, isMonthly) {
  const priceRanges = [
    { max: 500, monthly: Small_Monthly, yearly: Small_Yearly },
    { max: 2000, monthly: Mid_Monthly, yearly: Mid_Yearly },
    { max: 5000, monthly: Large_Monthly, yearly: Large_Yearly },
    { max: Infinity, monthly: Large_Monthly, yearly: Large_Yearly },
  ];

  for (const range of priceRanges) {
    if (userAmount < range.max) {
      return isMonthly ? range.monthly : range.yearly;
    }
  }
}
