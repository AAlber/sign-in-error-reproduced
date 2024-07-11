import cuid from "cuid";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import Switch from "@/src/components/reusable/settings-switches/switch";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import NumberInputField from "../number-input-field";
import DiscountTypeSelector from "./discount-type-selector";
import { useDiscountCreator } from "./zustand";

export default function MainDiscountCreator(props: {
  discountEnabled: boolean;
  setDiscountEnabled: (val: boolean) => void;
}) {
  const { discountEnabled, setDiscountEnabled } = props;
  const {
    durationInMonths,
    setDurationInMonths,
    setAmountOff,
    setPercentOff,
    percentOff,
    amountOff,
    type,
  } = useDiscountCreator();
  const [hidden, setHidden] = useState(false);
  const [amountOffKey, setAmountOffKey] = useState<string>(cuid());
  const [percentOffKey, setPercentOffKey] = useState<string>(cuid());
  useEffect(() => {
    if (amountOff !== undefined && percentOff !== undefined) {
      setPercentOff(undefined);
      setPercentOffKey(cuid());
    }
  }, [amountOff]);

  useEffect(() => {
    if (percentOff !== undefined && amountOff !== undefined) {
      setAmountOff(undefined);
      setAmountOffKey(cuid());
    }
  }, [percentOff]);

  useEffect(() => {
    if (type === "forever" || type === "once") {
      setDurationInMonths(undefined);
    } else if (type === "repeating" && !durationInMonths) {
      setDurationInMonths(1);
    }
  }, [type]);

  return (
    <div className="grid gap-2 rounded-md border border-border p-2">
      <div className="grid grid-cols-3">
        <Label
          htmlFor="theme-selector"
          className={classNames(
            "block text-sm font-medium text-contrast",
            discountEnabled && "font-semibold",
          )}
        >
          {"Main Subscription Discount"}
        </Label>
        <div className={classNames("col-span-2 flex w-full justify-end")}>
          <div className="flex flex-col gap-2">
            <Switch checked={discountEnabled} onChange={setDiscountEnabled} />
            {discountEnabled && (
              <Button variant="ghost" onClick={() => setHidden(!hidden)}>
                {hidden ? (
                  <ChevronDown className={"size-4"} />
                ) : (
                  <ChevronUp className={"size-4"} />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
      {discountEnabled && !hidden && (
        <div className="flex flex-col gap-2 border-t border-border p-2">
          <DiscountTypeSelector />
          {type === "repeating" && (
            <>
              <NumberInputField
                label={"Duration In Months"}
                setValue={setDurationInMonths}
                min={0}
                max={100}
                value={durationInMonths}
              />
              <div className="text-xs text-muted-contrast">
                {
                  "ex. If you want this discount to last for 2 yearly periods, you would set it to 24 months"
                }
              </div>
            </>
          )}
          <div
            className={classNames(
              percentOff && percentOff > 0 ? "opacity-20" : "",
            )}
          >
            <NumberInputField
              label={"Discount - €"}
              setValue={setAmountOff}
              min={0}
              key={amountOffKey}
              max={1000000}
              value={amountOff}
            />
          </div>
          <div
            className={classNames(
              amountOff && amountOff > 0 ? "opacity-20" : "",
            )}
          >
            <NumberInputField
              label={"Discount - %"}
              setValue={setPercentOff}
              key={percentOffKey}
              min={0}
              max={100}
              value={percentOff}
            />
          </div>
        </div>
      )}
    </div>
  );
}
