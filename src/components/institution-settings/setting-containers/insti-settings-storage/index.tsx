import { useEffect, useState } from "react";
import {
  getInstitutionStorageSettings,
  uploadInstitutionSettingsWithProcessToast,
} from "@/src/client-functions/client-institution-settings";
import { getStorageStatusData } from "@/src/client-functions/client-stripe/data-extrapolation";
import { Separator } from "@/src/components/reusable/shadcn-ui/separator";
import { toast } from "@/src/components/reusable/toaster/toast";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";
import type { InstitutionStorageStatus } from "@/src/types/storage.types";
import type { FuxamStripeSubscription } from "@/src/utils/stripe-types";
import SettingsSection from "../../../reusable/settings/settings-section";
import { useInstitutionSettings } from "../../zustand";
import StorageLimitSettings from "./storage-limit-settings";
import StorageStatusOverView from "./storage-status-overview";
import useStorageSettings from "./zustand";

export default function StorageSettings() {
  const { institutionSettings, updateInstitutionSettings } =
    useInstitutionSettings();
  const { setStorageStatus, setStorageSubscription, loading, setLoading } =
    useStorageSettings();
  const { storage_course_limit, storage_user_limit } = institutionSettings;

  const [userStorageLimit, setUserStorageLimit] = useState<number | undefined>(
    storage_user_limit,
  );

  const [courseStorageLimit, setCourseStorageLimit] = useState<
    number | undefined
  >(storage_course_limit);

  useEffect(() => {
    getInstitutionStorageSettings().then(
      (res: {
        storageStatus: InstitutionStorageStatus;
        storageSubscription: FuxamStripeSubscription;
      }) => {
        setStorageStatus(res.storageStatus);
        setStorageSubscription(res.storageSubscription);
        setLoading(false);
      },
    );
  }, []);
  const storageStatusData = getStorageStatusData();

  return (
    <SettingsSection
      title="storage_settings"
      subtitle="storage_settings_description"
      footerButtonText="general.save"
      footerButtonDisabled={
        institutionSettings.storage_course_limit === courseStorageLimit &&
        institutionSettings.storage_user_limit === userStorageLimit
      }
      footerButtonAction={async () => {
        if (!courseStorageLimit || !userStorageLimit) {
          return toast.error("please_fill_in_all_fields", {
            description: "please_set_course_user_drive_limit",
          });
        }
        const newSettings: InstitutionSettings = {
          ...institutionSettings,
          storage_course_limit: courseStorageLimit,
          storage_user_limit: userStorageLimit,
        };
        await uploadInstitutionSettingsWithProcessToast(newSettings);
        updateInstitutionSettings(newSettings);
      }}
    >
      <div>
        <StorageStatusOverView
          loading={loading}
          storageStatus={storageStatusData}
        />
        <div className={"h-2"}></div>
        <Separator />
        <StorageLimitSettings
          courseStorageLimit={courseStorageLimit}
          userStorageLimit={userStorageLimit}
          setCourseStorageLimit={setCourseStorageLimit}
          setUserStorageLimit={setUserStorageLimit}
        />
      </div>
    </SettingsSection>
  );
}
