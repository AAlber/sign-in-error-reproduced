import { BYTES_IN_1GB } from "@/src/utils/utils";
import useStorageSettings from "../../zustand";
import { QuantityInput } from "./package-quantity-selection";
import { PriceInfo } from "./price-info";
import { StorageInfo } from "./storage-info";

export default function PurchaseStorage() {
  const {
    storageSubscription,
    added25gbPackages,
    setAdded25gbPackages,
    loading,
  } = useStorageSettings();
  const subtotal = 20 * (added25gbPackages || 1);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;
  const currentQuantity = storageSubscription?.quantity;
  const currentQuantityInBytes = currentQuantity
    ? BYTES_IN_1GB * 25 * currentQuantity
    : null;

  return !storageSubscription && !loading ? (
    <div className="max-w-[752px] rounded-md border border-border">
      <div className="flex items-center justify-between rounded-lg p-4">
        <div className="flex space-x-8">
          <StorageInfo
            currentQuantity={currentQuantity}
            currentQuantityInBytes={currentQuantityInBytes}
          />
        </div>
        <div className="flex space-x-6 pt-1">
          <QuantityInput
            value={added25gbPackages}
            setValue={setAdded25gbPackages}
          />
          <PriceInfo subtotal={subtotal} tax={tax} total={total} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
