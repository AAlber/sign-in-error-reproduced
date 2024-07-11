import type { VideoChatProviderInstitutionSettingsProps } from "./video-chat-provider-integration.types";
import { defaultVideoChatProviderSettings } from "./video-chat-provider-integration.types";

export type InstitutionSettings = {
  // General grievous
  institution_language: "en" | "de";
  // Add Ons
  addon_artificial_intelligence: boolean;
  addon_user_profiles: boolean;
  addon_support_contact: boolean;
  addon_room_management: boolean;
  addon_lms_feedbacks: boolean;
  addon_schedule_monitor: boolean;
  addon_peer_feedback: boolean;
  addon_marketing_package: boolean;
  addon_ects_points: boolean;
  addon_ects_introductory_pdf: string;
  addon_ects_appendix_pdf: string;
  // Artificial Intelligence
  // Zoom
  use_own_zoom_account: boolean; // if true, it means they don't use S2S (S2S means using Fuxam's account).
  // Zoom S2S
  // S2S is "Server to Server app" by Zoom.
  // https://developers.zoom.us/docs/internal-apps/s2s-oauth/
  zoom_s2s_access_token: string; // Fuxam's account
  // Zoom General App
  // "General app" is another term by Zoom for an OAuth app.
  // https://developers.zoom.us/docs/zoom-apps/create/#process
  zoom_general_app_access_token: string;
  zoom_general_app_refresh_token: string;
  zoom_general_app_connected_email: string;
  // Feedbacks
  feedback_course: boolean;
  feedback_content_blocks: boolean;
  // User Profiles
  profile_information_required: boolean;
  // User - Statement of Independence
  statement_of_independence_required: boolean;
  // User Profiles - Custom Information Fields
  user_data_profile_bio: boolean;
  public_profile_bio: boolean;
  user_data_phone_number: boolean;
  public_phone_number: boolean;
  user_data_address: boolean;
  public_address: boolean;
  user_data_identifier: boolean;
  public_identifier: boolean;
  user_data_linkedIn: boolean;
  public_linkedIn: boolean;
  // Support Contact
  support_contact_userid: string;
  // Communication
  communication_messaging: boolean;
  communication_course_chat: boolean;
  // BigBlueButton
  bigbluebutton_api_url: string;
  bigbluebutton_api_secret: string;
  // Schedule Monitor
  schedule_monitor_show_empty_columns: boolean;
  schedule_monitor_split_every: number;
  // Appointment
  appointment_default_duration: number;
  appointment_default_offline: boolean;
  appointment_organizer_display: {
    id: string;
    name: string;
  };
  storage_gb_per_user: number;
  storage_course_limit: number;
  storage_user_limit: number;
  storage_base_gb: number;
  videoChatProviders: VideoChatProviderInstitutionSettingsProps[];
  integration_moodle: boolean;
};

export const defaultInstitutionSettings: InstitutionSettings = {
  // General grievous
  institution_language: "en",
  // Add Ons
  addon_artificial_intelligence: true,
  addon_user_profiles: false,
  addon_support_contact: false,
  addon_room_management: false,
  addon_lms_feedbacks: false,
  addon_schedule_monitor: false,
  addon_marketing_package: false,
  addon_ects_points: false,
  addon_peer_feedback: false,
  addon_ects_introductory_pdf: "",
  addon_ects_appendix_pdf: "",
  // Zoom
  use_own_zoom_account: false,
  zoom_s2s_access_token: "",
  zoom_general_app_access_token: "",
  zoom_general_app_refresh_token: "",
  zoom_general_app_connected_email: "",
  // Feedbacks
  feedback_course: false,
  feedback_content_blocks: false,
  // User Profiles
  profile_information_required: false,
  // User - Statement of Independence
  statement_of_independence_required: false,
  // User Profiles - Custom Information Fields
  user_data_profile_bio: true,
  public_profile_bio: true,
  user_data_phone_number: false,
  public_phone_number: false,
  user_data_address: false,
  public_address: false,
  user_data_identifier: false,
  public_identifier: false,
  user_data_linkedIn: false,
  public_linkedIn: false,
  // Support Contact
  support_contact_userid: "",
  // Communication
  communication_messaging: true,
  communication_course_chat: true,
  // BigBlueButton
  bigbluebutton_api_url: "",
  bigbluebutton_api_secret: "",
  // Schedule Monitor
  schedule_monitor_show_empty_columns: true,
  schedule_monitor_split_every: 0,
  // Appointment
  appointment_default_duration: 30,
  appointment_default_offline: false,
  appointment_organizer_display: {
    id: "name",
    name: "Name",
  },
  storage_base_gb: 25,
  storage_gb_per_user: 3,
  storage_course_limit: 3,
  storage_user_limit: 3,
  videoChatProviders: defaultVideoChatProviderSettings.map((provider) => ({
    id: provider.id,
    active: provider.active,
  })),
  integration_moodle: false,
};

export const protectedInstitutionSettings: (keyof InstitutionSettings)[] = [
  "bigbluebutton_api_secret",
  "zoom_s2s_access_token",
  "zoom_general_app_access_token",
  "zoom_general_app_refresh_token",
];

export type InstitutionUserProfile = {
  phone_number: string;
  address: string;
  identifier: string;
  profile_bio: string;
  linkedIn: string;
};
