import { useUser } from "@clerk/nextjs";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import confirmAction from "@/src/client-functions/client-options-modal";
import useConfirmationModal from "../popups/confirmation-modal/zustand";
import useNavigationOverlay, {
  CloudMode,
} from "../reusable/page-layout/navigator/zustand";
import { Button } from "../reusable/shadcn-ui/button";
import useCloudOverlay from "./zustand";

export default function ActionbButton() {
  const { cloudMode } = useNavigationOverlay();
  const {
    driveObject,
    googleIsValid,
    drive,
    uploadStep,
    onCloudExportSave,
    onCloudImportSelect,
  } = useCloudOverlay();

  const { t } = useTranslation("page");
  const { highlightedFile } = useCloudOverlay();
  const { uploadFileToDrive, currentFiles } = driveObject;
  const userId = useUser().user?.id;

  const initConfirmationModal = useConfirmationModal(
    (state) => state.initModal,
  );

  if (drive.id === 1 && !googleIsValid) return <></>;

  if (cloudMode === CloudMode.Import && userId)
    return (
      <Button
        enabled={highlightedFile !== (undefined || null)}
        onClick={async () => {
          onCloudImportSelect();
        }}
        variant={"cta"}
      >
        {t("cloud.action_button_select")}
      </Button>
    );
  if (cloudMode === CloudMode.Export)
    return (
      <Button
        onClick={async () => {
          onCloudExportSave();
        }}
      >
        {uploadStep === null
          ? t("general.save")
          : t("cloud.action_button_saving")}
      </Button>
    );

  return (
    <div className="group relative flex items-center justify-center rounded-md border border-border bg-background  px-3 py-2 text-sm font-medium text-contrast hover:bg-secondary ">
      <label
        htmlFor="mobile-user-photo"
        className="pointer-events-none relative flex-col text-sm font-medium leading-4 text-contrast"
      >
        <span>
          <Upload className="h-4 w-4 text-contrast" />
        </span>
        <span className="sr-only"> user photo</span>
      </label>
      <input
        id="mobile-user-photo"
        name="user-photo"
        type="file"
        onChange={async (event) => {
          if (event.target.files?.item(0) === null) return;
          if (event.target.files?.item(0) === undefined) return;

          let wasDuplicate = false;

          for (const file of currentFiles) {
            if (
              file.name === event.target.files?.item(0)?.name &&
              file.type !== "folder"
            ) {
              wasDuplicate = true;
              console.log("duplicate");
              confirmAction(
                async () => {
                  uploadFileToDrive(event.target.files?.item(0));
                },
                {
                  title: `${t("cloud.confirm_action_replace_file_title1")} ${
                    file.name
                  } ${t("cloud.confirm_action_replace_file_title2")}`,
                  description: `${t(
                    "cloud.confirm_action_replace_file_description1",
                  )} ${file.name}? ${t(
                    "cloud.confirm_action_replace_file_description2",
                  )}`,
                  actionName: "cloud.confirm_action_replace_file_action",
                },
              );
              // initConfirmationModal({
              //     title: `File called ${file.name} already exists.`,
              //     description: `Are you sure you want to replace the file ${file.name}? This action cannot be undone.`,
              //     actionName: "Confirm",
              //     onConfirm: async () => {
              //         uploadFileToDrive(event.target.files?.item(0));
              //     },
              // })
            }
          }
          if (!wasDuplicate) {
            uploadFileToDrive(event.target.files?.item(0));
          }
        }}
        className="absolute h-full w-full cursor-pointer rounded-md opacity-0"
      />
    </div>
  );
}
