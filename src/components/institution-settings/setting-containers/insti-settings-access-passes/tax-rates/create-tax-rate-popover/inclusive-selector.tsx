import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import { useTaxRates } from "../zustand";

export default function InclusiveSelector({
  setOpenTaxEditor,
}: {
  setOpenTaxEditor: (value: boolean) => void;
}) {
  const { selectedInclusiveTax, setSelectedInclusiveTax } = useTaxRates();
  const { t } = useTranslation("page");
  const incl = t("inclusive_long");
  const excl = t("exclusive_long");

  return (
    <div className="col-span-2 flex gap-1">
      <Select
        value={selectedInclusiveTax ? incl : excl}
        onOpenChange={() => setOpenTaxEditor(true)}
        onValueChange={(value) => setSelectedInclusiveTax(value === incl)}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {[incl, excl].map((item, index) => (
              <SelectItem value={item} key={index}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
