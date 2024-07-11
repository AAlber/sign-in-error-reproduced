import dynamic from "next/dynamic";
import useWhiteBoard from "./navigator/whiteboard/zustand";
import useNavigationOverlay from "./navigator/zustand";

export default function DialogsOverlay() {
  const whiteBoard = useWhiteBoard();
  const { showCloudWindow: cloudWindowPopUp } = useNavigationOverlay();

  return (
    <div className="pointer-events-none absolute z-50 flex h-screen w-screen items-center justify-center overflow-hidden">
      {/* <DriveTypeProvider driveType="user-drive">
        <UserDrive />
      </DriveTypeProvider> */}
      <FileDropModal />
      <AppointmentCreator />
      <ConfirmationModal />
      <CreateRoomModal />
      <GroupModal />
      <VideoPlayer />
      <AudioPlayer />
      <FileViewer />
      <RenameModal />
      <UserManagmentModal />
      <Workbench />
      <Editor />
      <ContentBlockCreator />
      <AppointmentAttendenceModal />
      <AppointmentCheckInModal />
      <ImportCourseDataModal />
      <RatingSchemaSettings />
      <UserOverview />
      <AccountModal />
      <RoomDialog />
      <ImportUser />
      <WelcomeLearnMenu />
      <AutoLessonChat />
      <DocuChat />
      <ContentBlockPreview />
      <SurveyDialog />
      {whiteBoard.isOpen && <Whiteboard />}
    </div>
  );
}

const ContentBlockPreview = dynamic(
  () => import("../../course/content-blocks/block-overview"),
);

const DocuChat = dynamic(() => import("../../../components/popups/docu-chat"));
const AutoLessonChat = dynamic(
  () => import("../../../components/popups/auto-lesson-chat"),
);

const AppointmentCreator = dynamic(
  () => import("../../popups/appointment-editor"),
);

const CreateRoomModal = dynamic(
  () =>
    import(
      "../../institution-settings/setting-containers/insti-settings-room-management/create-room-modal"
    ),
);
const ContentBlockCreator = dynamic(
  () => import("../../course/content-blocks/content-block-creator"),
);
const GroupModal = dynamic(
  () =>
    import(
      "../../institution-settings/setting-containers/insti-settings-groups/group-modal"
    ),
);
const RatingSchemaSettings = dynamic(
  () =>
    import(
      "../../institution-settings/setting-containers/insti-settings-rating-schema/rating-schema-settings"
    ),
);

const ConfirmationModal = dynamic(
  () => import("../../popups/confirmation-modal"),
);
const ImportCourseDataModal = dynamic(
  () => import("../../popups/import-course-data-modal"),
);
const FileViewer = dynamic(() => import("../../popups/file-viewer-sheet"));

const AppointmentCheckInModal = dynamic(
  () => import("../../popups/appointment-check-in"),
);
const AppointmentAttendenceModal = dynamic(
  () => import("../../popups/appointment-attendence"),
);

const RenameModal = dynamic(() => import("../../popups/input-modal"));
const RoomDialog = dynamic(() => import("../room-schedule/dialog"));
const UserManagmentModal = dynamic(
  () => import("../../popups/layer-user-management"),
);
const UserOverview = dynamic(() => import("../user-overview"));
const Whiteboard = dynamic(() => import("./navigator/whiteboard"));
const Workbench = dynamic(() => import("../../workbench-deprecated"));
const Editor = dynamic(() => import("../../editor/editor"));
const VideoPlayer = dynamic(() => import("../video-player"));
const AudioPlayer = dynamic(() => import("../audio-player/index"));
const FileDropModal = dynamic(
  () => import("../file-uploaders/file-drop-modal"),
);
const AccountModal = dynamic(
  () =>
    import(
      "../../dashboard/navigation/primary-sidebar/user-menu/account/account-modal"
    ),
);

const ImportUser = dynamic(
  () =>
    import(
      "../../institution-user-management/data-table/toolbar/import-users/modal"
    ),
);
const WelcomeLearnMenu = dynamic(
  () => import("../../popups/welcome-learn-menu"),
);

const SurveyDialog = dynamic(() => import("../../reusable/survey-dialog"));
