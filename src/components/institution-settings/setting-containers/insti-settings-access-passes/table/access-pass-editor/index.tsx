import { Pen } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  handleUpdateAccessPass,
  initAccessPassEditor,
} from "@/src/client-functions/client-access-pass";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { AccessPassWithPaymentInfo } from "@/src/utils/stripe-types";
import MaxMemberSelection from "../../add-access-pass-modal/create-pass-input-fields/max-member-selection";
import PaidAccessPassInput from "../../add-access-pass-modal/create-pass-input-fields/paid-access-pass-input";
import { useAccessPassEditor } from "./zustand";

export default function AccessPassEditor({
  accessPass,
}: {
  accessPass: AccessPassWithPaymentInfo;
}) {
  const { t } = useTranslation("page");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    maxUsers,
    setMaxUsers,
    withMemberLimit,
    setWithMemberLimit,
    taxRate,
    setTaxRate,
    priceForUser,
    setPriceForUser,
    description,
    setDescription,
    currency,
    setCurrency,
    isPaid,
    setIsPaid,
    name,
    setName,
  } = useAccessPassEditor();

  useEffect(() => {
    if (withMemberLimit && !maxUsers) {
      setMaxUsers(10000);
    }
  }, [withMemberLimit]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        onClick={() => {
          setOpen(true);
          initAccessPassEditor(accessPass);
        }}
      >
        <Pen className={" h-4 w-4"} />
      </PopoverTrigger>
      <PopoverContent side="right" className="ml-3 mt-7 w-[350px]">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await handleUpdateAccessPass(accessPass, setOpen);
            setLoading(false);
          }}
          className="grid gap-4"
        >
          {" "}
          <div>
            <div className="h-2"></div>
            <PaidAccessPassInput
              setName={setName}
              name={name}
              setTaxRate={setTaxRate}
              taxRate={taxRate}
              setPriceForUser={setPriceForUser}
              priceForUser={priceForUser}
              currency={currency}
              setCurrency={setCurrency}
              description={description}
              setDescription={setDescription}
              isPaid={isPaid}
              setIsPaid={setIsPaid}
            />
            <MaxMemberSelection
              maxUsers={maxUsers}
              setMaxUsers={setMaxUsers}
              withMemberLimit={withMemberLimit}
              setWithMemberLimit={setWithMemberLimit}
            />
            <div className="mt-2 flex justify-end">
              <Button type="submit">
                {loading ? t("general.loading") : t("general.update")}
              </Button>
            </div>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
