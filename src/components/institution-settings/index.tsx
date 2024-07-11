import { useEffect } from "react";
import { getInstitutionSettings } from "@/src/client-functions/client-institution-settings";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";
import SettingsTabContent from "../reusable/settings/settings-tab-content";
import Skeleton from "../skeleton";
import AddOns from "./marketplace/add-ons";
import Integrations from "./marketplace/integrations";
import { LayerBackups } from "./setting-containers/inst-settings-layer-backups";
import AccessPasses from "./setting-containers/insti-settings-access-passes";
import AdminList from "./setting-containers/insti-settings-admin-list";
import InstiAIUsageReportDisplay from "./setting-containers/insti-settings-ai/insti-ai-usage";
import OpenAIToken from "./setting-containers/insti-settings-ai/openai-token";
import AppointmentSettings from "./setting-containers/insti-settings-appointment";
import Billing from "./setting-containers/insti-settings-billing";
import Communication from "./setting-containers/insti-settings-communication";
import DangerZone from "./setting-containers/insti-settings-danger-zone";
import UserManagementGroups from "./setting-containers/insti-settings-groups";
import NameLogoSettings from "./setting-containers/insti-settings-name-logo-update/";
import RatingSchemaTable from "./setting-containers/insti-settings-rating-schema";
import StatementOfIndependence from "./setting-containers/insti-settings-statement-of-independence";
import StorageSettings from "./setting-containers/insti-settings-storage";
import StorageUpgrader from "./setting-containers/insti-settings-storage/storage-upgrader";
import SupportContactSelect from "./setting-containers/insti-settings-support-contact";
import UserManagementDataFields from "./setting-containers/insti-settings-user-data-points";
import ZoomSettings from "./setting-containers/insti-settings-zoom";
import { SettingId } from "./tabs";
import { useInstitutionSettings } from "./zustand";
import SettingsSkeleton from "./institution-settings-skeleton";

function InstitutionSettings({ tabId }) {
  const { setInstitutionSettings } = useInstitutionSettings();
  const { data, loading } = useAsyncData(() => getInstitutionSettings());

  useEffect(() => {
    if (!data) return;
    setInstitutionSettings(data);
  }, [data]);

  // Render the appropriate content based on tabId
  const renderContent = () => {
    switch (tabId) {
      case SettingId.General:
        return (
          <>
            <NameLogoSettings />
            <AdminList />
          </>
        );
      case SettingId.MarketplaceAddOns:
        return <AddOns />;
      case SettingId.MarketplaceIntegrations:
        return <Integrations />;
      case SettingId.AI:
        return (
          <>
            <InstiAIUsageReportDisplay />
            <OpenAIToken />
          </>
        );
      case SettingId.Storage:
        return <StorageSettings />;
      case SettingId.Billing:
        return <Billing />;
      case SettingId.LMS:
        return (
          <>
            <RatingSchemaTable />
            <StatementOfIndependence />
          </>
        );
      case SettingId.SupportContact:
        return <SupportContactSelect />;
      case SettingId.Zoom:
        return <ZoomSettings />;
      case SettingId.UserData:
        return (
          <>
            <UserManagementGroups />
            <UserManagementDataFields />
          </>
        );
      case SettingId.AccessPasses:
        return <AccessPasses />;
      case SettingId.DataStoragePrivacy:
        return (
          <>
            <StorageSettings />
            <StorageUpgrader />
            <LayerBackups />
            <DangerZone />
          </>
        );
      case SettingId.Communication:
        return <Communication />;
      case SettingId.Schedule:
        return <AppointmentSettings />;
      default:
        return null; // Render nothing if tabId doesn't match any case
    }
  };

  return (
    <SettingsTabContent>
      {loading ? <SettingsSkeleton /> : renderContent()}
    </SettingsTabContent>
  );
}

export default InstitutionSettings;
