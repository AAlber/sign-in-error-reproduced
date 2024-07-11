import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  encryptPaymentSettings,
  getMainSubCouponData,
} from "@/src/client-functions/client-admin-dashboard";
import {
  getPricingModel,
  Standard_Support,
} from "@/src/client-functions/client-stripe/price-id-manager";
import { copyToClipBoard } from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import useThemeStore from "../../dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import DefaultPlanSelector from "../../institution-settings/setting-containers/insti-settings-billing/plan-selector/default-plan-selector";
import { usePlanSelector } from "../../institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { useAdminDash } from "../table/zustand";
import CommonForm from "./common-form";
import OrganizationSummary from "./organization-summary";
import { useCreatePaymentLink } from "./zustand";

export default function CreatePaymentLink() {
  const { t } = useTranslation("page");
  const {
    open,
    setOpen,
    logoLink,
    setLogoLink,
    aiCredits,
    setAiCredits,
    baseStorageGb,
    setBaseStorageGb,
    gbPerUser,
    setGbPerUser,
    accessPassDiscount,
    setAccessPassDiscount,
    language,
    setLanguage,
    setName,
    name,
    discountEnabled,
    setDiscountEnabled,
  } = useCreatePaymentLink();
  const {
    userAmount,
    billingPeriod,
    supportPackage,
    setSupportPackage,
    setUserAmount,
    setBillingPeriod,
  } = usePlanSelector();
  const { adminDashPassword } = useAdminDash();
  const { instiTheme } = useThemeStore();
  const [copyingLink, setCopyingLink] = useState<boolean>(false);
  const [copyWasClicked, setCopyWasClicked] = useState<boolean>(false);

  useEffect(() => {
    if (!copyWasClicked) return;
    setTimeout(() => {
      setCopyWasClicked(false);
    }, 1000);
    setOpen(false);
  }, [copyWasClicked]);

  useEffect(() => {
    if (open) return;
    setLogoLink(undefined);
    setName(undefined);
    setSupportPackage(Standard_Support);
    setUserAmount(3);
    setBillingPeriod("yearly");
    setGbPerUser(3);
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger onClick={() => setOpen(true)}>
        <Button>Create Payment Link</Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="ml-3 mt-7 w-[900px]">
        <div className="flex gap-4">
          <div className="grid gap-4">
            <CommonForm
              name={name}
              setName={setName}
              language={language}
              setLanguage={setLanguage}
              aiCredits={aiCredits}
              setAiCredits={setAiCredits}
              gbPerUser={gbPerUser}
              setGbPerUser={setGbPerUser}
              baseStorageGb={baseStorageGb}
              setBaseStorageGb={setBaseStorageGb}
              accessPassDiscount={accessPassDiscount}
              setAccessPassDiscount={setAccessPassDiscount}
              setLogoLink={setLogoLink}
              discountEnabled={discountEnabled}
              setDiscountEnabled={setDiscountEnabled}
            />
            <DefaultPlanSelector peekDirection="left" />
            <div className="flex justify-end">
              <Button
                variant="cta"
                disabled={!name || !gbPerUser || !baseStorageGb || !userAmount}
                className="shrink-0"
                onClick={async () => {
                  const mainSubCouponData =
                    getMainSubCouponData("payment-link");
                  setCopyingLink(true);
                  const paymentSettings = await encryptPaymentSettings({
                    paymentSettings: {
                      instiTheme,
                      language,
                      logoLink,
                      gbPerUser: gbPerUser!,
                      baseStorageGb: baseStorageGb!,
                      name: name!,
                      standardSubscriptionItem: {
                        priceId: getPricingModel(
                          userAmount,
                          billingPeriod === "monthly",
                        )!,
                        quantity: userAmount!,
                      },
                      aiCredits,
                      accessPassDiscount,
                      supportPackagePriceId: supportPackage,
                      mainSubCouponData,
                    },
                    adminDashPassword,
                  });
                  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}onboarding?paymentSettings=${paymentSettings}`;
                  setCopyingLink(false);
                  copyToClipBoard(url);
                  setCopyWasClicked(true);
                }}
              >
                {copyingLink
                  ? "Copying..."
                  : copyWasClicked
                  ? "Copied"
                  : t("copy_link")}
              </Button>{" "}
            </div>
          </div>
          <OrganizationSummary creatorType="payment-link" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
