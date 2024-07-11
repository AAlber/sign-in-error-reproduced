import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import { useCreatePaymentLink } from "../../zustand";
import { useDiscountCreator } from "./zustand";

export default function DiscountTypeSelector() {
  const { t } = useTranslation("page");
  const { type, setType } = useDiscountCreator();

  const { open, setOpen } = useCreatePaymentLink();
  return (
    <div className="grid grid-cols-3">
      <Label
        htmlFor="discount-type-selector"
        className={classNames("block text-sm font-medium")}
      >
        {t("Discount Type")}
      </Label>
      <div className={classNames("col-span-2 flex justify-end")}>
        <Select
          value={type}
          onValueChange={(val: "once" | "repeating" | "forever") =>
            setType(val)
          }
        >
          <SelectTrigger>
            <SelectValue
              onClick={() => {
                setOpen(true);
              }}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"once"} key={"once"}>
                {"once"}
              </SelectItem>
              <SelectItem value={"repeating"} key={"repeating"}>
                {"repeating"}
              </SelectItem>

              <SelectItem value={"forever"} key={"forever"}>
                {"forever"}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
