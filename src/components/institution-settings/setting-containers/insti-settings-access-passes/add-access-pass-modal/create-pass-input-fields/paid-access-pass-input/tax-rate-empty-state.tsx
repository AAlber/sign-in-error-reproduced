import { Landmark } from "lucide-react";
import { EmptyState } from "@/src/components/reusable/empty-state";

export default function TaxRateEmptyState({
  size,
}: {
  size: "small" | "normal";
}) {
  return (
    <EmptyState
      title="tax_rate_selector_no_rates_to_select"
      description="tax_rate_selector_no_rates_to_select_description"
      size={size}
      icon={Landmark}
    />
  );
}
