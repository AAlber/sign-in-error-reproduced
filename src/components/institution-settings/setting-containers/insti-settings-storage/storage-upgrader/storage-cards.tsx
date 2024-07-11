import { useTranslation } from "react-i18next";
import { isTestInstitution } from "@/src/client-functions/client-stripe/data-extrapolation";
import { isPartOfFakeTrialInstitutions } from "@/src/utils/functions";
import { useInstitutionSettings } from "../../../zustand";
import useStorageSettings from "../zustand";
import AdditionalStorage from "./additional-storage";
import { StorageCard } from "./storage-card-item";

export default function StorageCards() {
  const { t } = useTranslation("page");
  const { storageSubscription } = useStorageSettings();
  const { institutionSettings } = useInstitutionSettings();
  const quantity = storageSubscription?.quantity;
  const hasPlan = !isTestInstitution() || isPartOfFakeTrialInstitutions();

  return (
    <div className="mb-2 flex gap-4">
      {hasPlan ? (
        <StorageCard
          title={t("subscription_bonus")}
          storage={institutionSettings.storage_base_gb + "GB"}
          price={t("free")}
        />
      ) : (
        <StorageCard
          title={t("trial_subscription_bonus")}
          storage="1GB"
          price={t("free")}
        />
      )}
      {institutionSettings.storage_gb_per_user > 0 && hasPlan && (
        <StorageCard
          title={t("subscription_bonus")}
          storage={
            <>
              {institutionSettings.storage_gb_per_user}GB
              <span className="pl-1 text-xl">{t("per_user")}</span>
            </>
          }
          price={t("free")}
        />
      )}
      <AdditionalStorage />
    </div>
  );
}
