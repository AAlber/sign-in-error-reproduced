import InstitutionSettings from "../../index";
import { SettingId } from "../../tabs";
import { useInstitutionSettings } from "../../zustand";
import InstiAIUsageReportDisplay from "../insti-settings-ai/insti-ai-usage";
import OpenAIToken from "../insti-settings-ai/openai-token";
import BigBlueButton from "../insti-settings-bigbluebutton";
import CourseFeedback from "../insti-settings-course-feedback";
import EctsPointsSettings from "../insti-settings-ects-points";
import MoodleSettings from "../insti-settings-moodle";
import RoomManagement from "../insti-settings-room-management";
import ScheduleMonitor from "../insti-settings-schedule-monitor";
import ZoomSettings from "../insti-settings-zoom";

type Props = {
  tabId: number;
};

export default function InstiSettingsWithMenuContent({ tabId }: Props) {
  const { currentMenuContent } = useInstitutionSettings();

  switch (currentMenuContent?.id) {
    case SettingId.RoomManagement:
      return <RoomManagement />;
    case SettingId.CourseFeedback:
      return <CourseFeedback />;
    case SettingId.ScheduleMonitor:
      return <ScheduleMonitor />;
    case SettingId.ECTSPoints:
      return <EctsPointsSettings />;
    case SettingId.AI:
      return (
        <>
          <InstiAIUsageReportDisplay />
          <OpenAIToken />
        </>
      );
    case SettingId.BigBlueButton:
      return <BigBlueButton />;
    case SettingId.Zoom:
      return <ZoomSettings />;
    case SettingId.Moodle:
      return <MoodleSettings />;
    default:
      return <InstitutionSettings tabId={tabId} />;
  }
}
