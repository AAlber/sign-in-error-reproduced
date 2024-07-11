import BillingPeriodMenu from "./billing-period-menu";
import AccessPassLayerSelector from "./layer-selector";

export default function BasicAccessPassInput() {
  return (
    <div>
      <div className="mt-2 grid grid-cols-2 gap-1 text-sm text-contrast">
        <BillingPeriodMenu />
        <AccessPassLayerSelector />
      </div>
    </div>
  );
}
