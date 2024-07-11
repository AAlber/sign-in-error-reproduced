import {
  CalendarCheck2,
  Circle,
  CreditCard,
  Database,
  Nfc,
  Package,
  PenTool,
  Puzzle,
  Store,
  Ticket,
} from "lucide-react";

export enum SettingId {
  General,
  LMS,
  UserData,
  Marketplace,
  MarketplaceAddOns,
  MarketplaceIntegrations,
  Schedule,
  Communication,
  Payment,
  Billing,
  AccessPasses,
  DataStoragePrivacy,
  AI,
  BigBlueButton,
  Zoom,
  RoomManagement,
  CourseFeedback,
  SupportContact,
  ScheduleMonitor,
  YourAddons,
  Storage,
  Moodle,
  ECTSPoints,
}

export default function getInstitutionSettingsTabs(): SettingsTab[] {
  return [
    {
      id: SettingId.General,
      name: "organization_settings.navbar_general",
      type: "button",
      icon: <Circle className="h-4 w-4" />,
    },
    {
      id: SettingId.LMS,
      name: "organization_settings.navbar_lms",
      type: "button",
      icon: <PenTool className="h-4 w-4" />,
    },
    {
      id: SettingId.UserData,
      name: "organization_settings.user_data",
      type: "button",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: SettingId.Schedule,
      name: "organization_settings.navbar_schedule",
      type: "button",
      icon: <CalendarCheck2 className="h-4 w-4" />,
    },
    {
      id: SettingId.Communication,
      name: "organization_settings.navbar_communication",
      type: "button",
      icon: <Nfc className="h-4 w-4" />,
    },
    {
      id: SettingId.DataStoragePrivacy,
      name: "organization_settings.navbar_data_privacy",
      type: "button",
      icon: <Database className="h-4 w-4" />,
    },
    {
      id: SettingId.Marketplace,
      name: "organization_settings.navbar_marketplace",
      type: "menu",
      icon: <Store className="h-4 w-4" />,
      tabs: [
        {
          id: SettingId.MarketplaceAddOns,
          name: "organization_settings.navbar_marketplace_add_ons",
          icon: <Package className="h-4 w-4" />,
        },
        {
          id: SettingId.MarketplaceIntegrations,
          name: "organization_settings.navbar_marketplace_integrations",
          icon: <Puzzle className="h-4 w-4" />,
        },
      ],
    },
    {
      id: SettingId.Payment,
      name: "organization_settings.navbar_payment",
      type: "menu",
      icon: <CreditCard className="h-4 w-4" />,
      tabs: [
        {
          id: SettingId.Billing,
          name: "organization_settings.navbar_billing",
          icon: <CreditCard className="h-4 w-4" />,
        },

        {
          id: SettingId.AccessPasses,
          name: "organization_settings.navbar_users_access_access_passes",
          icon: <Ticket className="h-4 w-4" />,
        },
      ],
    },
  ];
}
