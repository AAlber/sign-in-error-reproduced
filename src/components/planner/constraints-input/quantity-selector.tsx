import { useTranslation } from "react-i18next";
import { LoadingSparkles } from "../../reusable/loading-sparkles";
import { Input } from "../../reusable/shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../reusable/shadcn-ui/select";
import usePlanner from "../zustand";
import { ContraintPreferenceItem } from "./contraint-preference-item";

export default function QuantitySelector() {
  const { t } = useTranslation("page");
  const { aiLoading, constraints, updateConstraints } = usePlanner();

  const handleUpdateConstraints = (e) => {
    // parse number
    const quantity = parseInt(e.target.value, 10);
    // update constraints
    updateConstraints({
      quantity: {
        ...constraints.quantity,
        value: quantity,
      },
    });
  };

  return (
    <ContraintPreferenceItem
      title="planner_quantity_title"
      description="planner_quantity_description"
    >
      <LoadingSparkles loading={aiLoading} particleDensity={500} id="quantity">
        <div className="relative flex items-center">
          <Input
            type="number"
            value={constraints.quantity.value}
            onChange={handleUpdateConstraints}
            className="rounded-r-none"
          />
          <Select
            value={constraints.quantity.type}
            onValueChange={(value) => {
              updateConstraints({
                quantity: {
                  ...constraints.quantity,
                  type: value as "appointments" | "hours",
                },
              });
            }}
          >
            <SelectTrigger className="rounded-l-none border-l-0 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["appointments", "hours"].map((item, index) => (
                <SelectItem value={item} key={index}>
                  {t(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </LoadingSparkles>
    </ContraintPreferenceItem>
  );
}
