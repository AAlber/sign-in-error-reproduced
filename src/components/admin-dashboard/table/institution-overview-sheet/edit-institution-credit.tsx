import { Pen } from "lucide-react";
import { memo, useState } from "react";
import { NumberInput } from "@/src/components/reusable/number-input";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";
import type { CouponCreateData } from "@/src/utils/stripe-types";
import { useAdminDash } from "../zustand";
import CreditSaveButton from "./save-button";

export type CreditEditData = {
  baseStorageGb?: number;
  gbPerUser?: number;
  accessPassDiscount?: number;
  aiCredits?: number;
  mainSubCouponData?: CouponCreateData;
};

const CreditEditor = memo(function CreditEditor({
  val,
  setVal,
  defaultValue,
  min,
  max,
  title,
  creditEditData,
  onSuccess,
}: {
  val: number | undefined;
  setVal: (val?: number) => void;
  defaultValue?: number;
  min: number;
  max: number;
  creditEditData: Partial<CreditEditData>;
  title: string;
  onSuccess?: (data: any) => void;
}) {
  const { openedAdminDashInstitution } = useAdminDash();
  const institution = openedAdminDashInstitution?.institution;
  const [open, setOpen] = useState<boolean>(false);

  return (
    institution && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger onClick={() => setOpen(true)}>
          <Button variant={"ghost"}>
            {" "}
            <Pen className={"size-4"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="ml-3 mt-7 w-[350px]">
          <div className="text-sm text-muted-contrast">{title}</div>
          <div className="flex gap-2">
            <div className="w-[200px]">
              <NumberInput
                defaultValue={defaultValue}
                value={val}
                setValue={setVal}
                min={min}
                max={max}
              />
            </div>
            <CreditSaveButton
              creditEditData={creditEditData}
              onSuccess={onSuccess}
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  );
});
export default CreditEditor;
