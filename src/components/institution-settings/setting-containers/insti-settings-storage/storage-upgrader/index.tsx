import {
  createBillingPortalSession,
  purchaseAdditionalStorage,
} from "@/src/client-functions/client-stripe";
import SettingsSection from "../../../../reusable/settings/settings-section";
import { SettingId } from "../../../tabs";
import useStorageSettings from "./../zustand";
import PurchaseStorage from "./purchase-storage";
import StorageCards from "./storage-cards";

export default function StorageUpgrader() {
  const { storageSubscription, added25gbPackages } = useStorageSettings();
  return (
    <SettingsSection
      title="purchase_more_storage"
      subtitle="purchase_more_storage_description"
      footerButtonText={
        storageSubscription ? "general.upgrade" : "general.checkout"
      }
      footerButtonDisabled={false}
      footerButtonAction={async () => {
        if (storageSubscription) {
          const url = await createBillingPortalSession({
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}?page=ORGANIZATION_SETTINGS&tab=${SettingId.DataStoragePrivacy}`,
            subscriptionId: storageSubscription.id,
          });
          window.location.assign(url);
        } else {
          if (!added25gbPackages) return;
          const res = await purchaseAdditionalStorage(added25gbPackages);
          window.location.assign(res.sessionUrl);
        }
      }}
    >
      <StorageCards />
      <PurchaseStorage />
    </SettingsSection>
  );
}
