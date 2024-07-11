import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  adminDashCreateInstitution,
  getMainSubCouponData,
} from "@/src/client-functions/client-admin-dashboard";
import { Standard_Support } from "@/src/client-functions/client-stripe/price-id-manager";
import useThemeStore from "@/src/components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import { usePlanSelector } from "@/src/components/institution-settings/setting-containers/insti-settings-billing/plan-selector/zustand";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import { toast } from "../../../reusable/toaster/toast";
import { useAdminDash } from "../../table/zustand";
import CommonForm from "../common-form";
import OrganizationSummary from "../organization-summary";
import { useCreateInstitutionPopover } from "../zustand";
import DurationSelectorField from "./duration-selector-field";
import EmailInput from "./email-input";

export default function CreateInstitutionPopover() {
  const { t } = useTranslation("page");
  const {
    name,
    setName,
    setEmail,
    email,
    language,
    duration,
    aiCredits,
    setAiCredits,
    setLanguage,
    setDuration,
    open,
    setOpen,
    logoLink,
    loading,
    setLoading,
    gbPerUser,
    setGbPerUser,
    accessPassDiscount,
    setAccessPassDiscount,
    baseStorageGb,
    setBaseStorageGb,
    setLogoLink,
    discountEnabled,
    setDiscountEnabled,
  } = useCreateInstitutionPopover();

  const { instiTheme } = useThemeStore();

  const { setAdminDashInstitutions, adminDashInstitutions } = useAdminDash();
  const { adminDashPassword } = useAdminDash();
  const { setSupportPackage, setUserAmount, setBillingPeriod } =
    usePlanSelector();
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
        <Button>Add Institution</Button>
      </PopoverTrigger>
      <PopoverContent side="right" className="ml-3 mt-7 flex w-[850px] gap-4">
        <div className="grid gap-4">
          <EmailInput email={email} setEmail={setEmail} />
          <DurationSelectorField
            duration={duration}
            setDuration={setDuration}
          />
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
          <div className="grid gap-2">
            <div className="flex justify-end">
              <Button
                disabled={
                  loading === true ||
                  name === undefined ||
                  name === "" ||
                  email === "" ||
                  email === undefined ||
                  gbPerUser === undefined ||
                  baseStorageGb === undefined ||
                  aiCredits === undefined
                }
                type="button"
                variant="cta"
                onClick={async (e) => {
                  if (!isValidEmail(email!)) return;
                  const mainSubCouponData = getMainSubCouponData(
                    "create-organization",
                  );
                  if (!mainSubCouponData && discountEnabled) return;
                  setLoading(true);
                  const res = await adminDashCreateInstitution({
                    adminDashPassword,
                    amountOfSubscriptionMonths: duration,
                    language,
                    name: name!,
                    email: email!,
                    aiCredits: aiCredits!,
                    gbPerUser: gbPerUser!,
                    baseStorageGb: baseStorageGb!,
                    logoLink,
                    instiTheme,
                    accessPassDiscount,
                    mainSubCouponData,
                  });
                  if (res?.ok) {
                    toast.success("Institution Created", {
                      description: "Hell yeah!",
                    });
                  }
                  setAdminDashInstitutions([res, ...adminDashInstitutions]);
                  setLoading(false);
                  setOpen(false);
                }}
              >
                {t("general.create")}
              </Button>
            </div>
          </div>{" "}
        </div>{" "}
        <OrganizationSummary creatorType={"create-organization"} />
      </PopoverContent>{" "}
    </Popover>
  );
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const valid = emailRegex.test(email);

  if (!valid) {
    toast.error("Invalid email address", {
      description: "Please enter a valid email address",
    });
  }

  return valid;
}
