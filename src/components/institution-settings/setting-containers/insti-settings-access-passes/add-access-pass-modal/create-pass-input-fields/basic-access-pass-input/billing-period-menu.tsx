import { useTranslation } from "react-i18next";
import { formatEnumKey } from "@/src/client-functions/client-access-pass/utils";
import {
  accessPassPriceArray,
  AccessPassPricesProd,
} from "@/src/client-functions/client-stripe/price-id-manager";
import { getEnumKeys } from "@/src/client-functions/client-utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import { useAccessPassCreator } from "../../zustand";

export default function BillingPeriodMenu() {
  const { setPriceId, priceId } = useAccessPassCreator();
  const { t } = useTranslation("page");
  const keys = getEnumKeys(AccessPassPricesProd);
  return (
    <>
      <div className="py-2">{t("duration")}</div>
      <Select value={priceId} onValueChange={(value) => setPriceId(value)}>
        <SelectTrigger className="h-8 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {accessPassPriceArray.map((item, index) => (
              <SelectItem value={item} key={index}>
                {formatEnumKey(keys[index] as string)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
