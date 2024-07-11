import cuid from "cuid";
import { Pen } from "lucide-react";
import { memo, useState } from "react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import MainDiscountCreator from "../../top-right-menu/common-form/main-subscription-discount";
import { useDiscountCreator } from "../../top-right-menu/common-form/main-subscription-discount/zustand";
import { useAdminDash } from "../zustand";
import { DeleteCouponButton } from "./coupon-delete-button";
import CreditEditor from "./edit-institution-credit";
import InstitutionDataItem from "./institution-data-item";
import CreditSaveButton from "./save-button";
import { useCreditEditorZustand } from "./zustand";

const CreditDataEditor = memo(function CreditDataEditor() {
  const {
    openedAdminDashInstitution,
    setAdminDashInstitutions,
    adminDashInstitutions,
  } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  const credits = openedAdminDashInstitution?.credits;
  const {
    accessPassDiscount,
    aiCredits,
    baseStorageGb,
    gbPerUser,
    setBaseStorageGb,
    setGbPerUser,
    setAiCredits,
    setAccessPassDiscount,
  } = useCreditEditorZustand();
  function makeCopyAndFindInstituton() {
    const copyOfInstitutions = [...adminDashInstitutions];
    const index = copyOfInstitutions.findIndex(
      (i) => i.institution.id === institution.id,
    );
    const current = copyOfInstitutions[index];
    return { current, copyOfInstitutions };
  }
  const mainSubdiscountId =
    openedAdminDashInstitution?.institution.stripeAccount
      ?.mainSubscriptionCouponId;

  const { amountOff, percentOff, type, durationInMonths } =
    useDiscountCreator();

  const [openDiscountEditor, setOpenDiscountEditor] = useState<boolean>(false);
  console.log("mainSubdiscountId", mainSubdiscountId);
  return (
    institution && (
      <>
        <div className="mt-2 text-lg font-semibold">Credits</div>
        <div className="flex justify-between gap-2">
          <InstitutionDataItem
            label="AI Credits"
            value={credits?.aiCredits?.toString() || "0"}
          />
          <CreditEditor
            title="Update AI Credits"
            val={aiCredits}
            defaultValue={credits?.aiCredits}
            setVal={setAiCredits}
            min={0}
            onSuccess={(newCredits) => {
              const { current, copyOfInstitutions } =
                makeCopyAndFindInstituton();
              if (current) {
                current.credits.aiCredits = newCredits;
                setAdminDashInstitutions(copyOfInstitutions);
              }
            }}
            max={1000000000}
            creditEditData={{
              aiCredits,
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <InstitutionDataItem
            label="Storage Per User"
            value={credits?.gbPerUser + "GB"}
          />
          <CreditEditor
            title="Update Storage GB Per User"
            val={gbPerUser}
            defaultValue={credits?.gbPerUser}
            setVal={setGbPerUser}
            min={0}
            max={1000}
            creditEditData={{
              gbPerUser,
            }}
            onSuccess={(newCredits) => {
              const { current, copyOfInstitutions } =
                makeCopyAndFindInstituton();
              if (current) {
                current.credits.gbPerUser = newCredits;
                setAdminDashInstitutions(copyOfInstitutions);
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <InstitutionDataItem
            label="Base Organization Storage"
            value={credits?.baseStorageGb + "GB"}
          />
          <CreditEditor
            title="Update base storage GB"
            val={baseStorageGb}
            defaultValue={credits?.baseStorageGb}
            setVal={setBaseStorageGb}
            min={0}
            max={10000}
            creditEditData={{
              baseStorageGb,
            }}
            onSuccess={(newCredits) => {
              const { current, copyOfInstitutions } =
                makeCopyAndFindInstituton();
              if (current) {
                current.credits.baseStorageGb = newCredits;
                setAdminDashInstitutions(copyOfInstitutions);
              }
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <InstitutionDataItem
            label="Access Pass Discount"
            value={
              credits?.accessPassCouponId
                ? credits?.accessPassCouponId?.split("-")[3] + "%"
                : "None"
            }
          />
          <div className="flex">
            <CreditEditor
              title="Update Access Pass Discount %"
              val={accessPassDiscount}
              setVal={setAccessPassDiscount}
              min={0}
              max={10000}
              creditEditData={{
                accessPassDiscount,
              }}
              onSuccess={(newCredits) => {
                const { current, copyOfInstitutions } =
                  makeCopyAndFindInstituton();
                if (current) {
                  current.credits.accessPassCouponId =
                    "access-pass-discount-" + newCredits + "-" + cuid();
                  setAdminDashInstitutions(copyOfInstitutions);
                }
              }}
            />
            {credits?.accessPassCouponId && (
              <DeleteCouponButton
                institutionId={institution.id}
                type="access-pass"
              />
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <InstitutionDataItem
            label="Main Sub Discount"
            value={
              !!mainSubdiscountId
                ? mainSubdiscountId?.split("-")[3] +
                  (mainSubdiscountId?.split("-")[4] === "percent"
                    ? "% "
                    : "€ ") +
                  mainSubdiscountId?.split("-")[5]
                : "None"
            }
          />

          <div className="flex">
            <Popover
              open={openDiscountEditor}
              onOpenChange={setOpenDiscountEditor}
            >
              <PopoverTrigger onClick={() => setOpenDiscountEditor(true)}>
                <Button variant={"ghost"}>
                  {" "}
                  <Pen className={"size-4"} />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right" className="ml-3 mt-7 w-[350px]">
                <MainDiscountCreator
                  discountEnabled={true}
                  setDiscountEnabled={() => {
                    console.log("test");
                  }}
                />
                <div className="mt-2 flex justify-end">
                  <CreditSaveButton
                    creditEditData={{
                      mainSubCouponData: {
                        amount_off: amountOff ? amountOff * 100 : undefined,
                        percent_off: percentOff,
                        duration: type,
                        duration_in_months: durationInMonths,
                      },
                    }}
                    onSuccess={(newCredits) => {
                      const { current, copyOfInstitutions } =
                        makeCopyAndFindInstituton();
                      const { amountOff, percentOff, type } =
                        useDiscountCreator.getState();
                      if (current) {
                        const identifier = percentOff
                          ? percentOff + "-percent"
                          : amountOff + "-euro";
                        current.institution.stripeAccount.mainSubscriptionCouponId =
                          "main-sub-discount-" +
                          identifier +
                          "-" +
                          type +
                          "-" +
                          cuid();

                        setAdminDashInstitutions(copyOfInstitutions);
                      }
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
            {mainSubdiscountId && (
              <DeleteCouponButton
                institutionId={institution.id}
                type="main-subscription"
              />
            )}
          </div>
        </div>
      </>
    )
  );
});
export default CreditDataEditor;
