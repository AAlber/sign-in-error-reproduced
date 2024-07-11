import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/reusable/shadcn-ui/select";
import type { ClientStripeCurrency } from "@/src/utils/stripe-types";

export default function CurrencySelector({
  selectedCurrency,
  setSelectedCurrency,
}: {
  selectedCurrency?: ClientStripeCurrency;
  setSelectedCurrency: (value: ClientStripeCurrency) => void;
}) {
  return (
    <div className="mb-4 w-12">
      <Select
        value={selectedCurrency}
        onValueChange={(value: ClientStripeCurrency) =>
          setSelectedCurrency(value)
        }
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {["€", "$"].map((item, index) => (
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
