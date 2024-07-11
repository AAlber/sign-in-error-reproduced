export type VideoChatProviderId = "" | "bbb" | "zoom";

export type VideoChatProviderProps = {
  active: boolean;
  iconSrc: string;
  iconAlt: string;
  id: VideoChatProviderId;
  isBeta: boolean;
  subtitle: string;
  settingsPage?: number;
  title: string;
};

export type VideoChatProviderInstitutionSettingsProps = Pick<
  VideoChatProviderProps,
  "active" | "id"
>;

export const defaultVideoChatProviderSettings: VideoChatProviderProps[] = [
  {
    active: false,
    iconAlt: "Big Blue Button",
    iconSrc: "/addons/bbb.svg",
    id: "bbb",
    isBeta: true,
    subtitle: "organization_settings.add_ons_big_blue_button_subtitle",
    settingsPage: 12,
    title: "organization_settings.add_ons_big_blue_button_title",
  },
  {
    active: false,
    iconAlt: "Zoom",
    iconSrc: "/addons/zoom.svg",
    id: "zoom",
    isBeta: true,
    subtitle: "organization_settings.add_ons_zoom_subtitle",
    settingsPage: 14,
    title: "Zoom",
  },
];
