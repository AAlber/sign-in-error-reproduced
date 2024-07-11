import { create } from "zustand";
import type { OpenOrigin } from "@/src/file-handlers/zustand";
import type { InstitutionSettings } from "@/src/types/institution-settings.types";
import useUser from "../../../../zustand/user";
import useCloudOverlay from "../../../cloud-overlay/zustand";
import { toast } from "../../toaster/toast";

interface CloudImportArgs {
  errorDescription?: string;
  acceptedFileTypes: string[];
  onSelect: (args: OnSelectArgs) => Promise<void>;
  openOrigin: OpenOrigin;
  onCancel: () => void;
}

interface CloudExportArgs {
  errorDescription?: string;
  onSave: (args: OnSaveArgs) => Promise<UploadObject>;
}
export type UploadObject = {
  name: string;
  file: any;
  type: string | undefined;
};
export interface OnSaveArgs {
  errorDescription: string;
}

export interface OnSelectArgs {
  fileBlob: any;
  openOrigin: OpenOrigin;
  errorDescription: string;
  fileName?: string;
}
export enum CloudMode {
  Default,
  Import,
  Export,
}

interface NavigationOverlay {
  showCloudWindow: boolean;
  cloudMode: CloudMode;
  showPlanner: boolean;
  showSettings: boolean;
  institutionSettings: Partial<InstitutionSettings>;
  closePlanner: () => void;
  closeCloud: () => void;
  openCloud: () => void;
  openCloudExport: (args: CloudExportArgs) => void;
  openCloudImport: (args: CloudImportArgs) => void;
  togglePlanner: () => void;
  toggleSettings: () => void;
  setInstitutionSettings: (data: Partial<InstitutionSettings>) => void;
}

const initalState = {
  cloudMode: CloudMode.Default,
  showCloudWindow: false,
  showNotifications: false,
  showPlanner: false,
  showSettings: false,
  institutionSettings: {},
};

const useNavigationOverlay = create<NavigationOverlay>()((set) => ({
  ...initalState,
  closePlanner: () => set(() => ({ showPlanner: false })),
  closeCloud: () => {
    const { setHighlightedFile } = useCloudOverlay.getState();
    set({ showCloudWindow: false, cloudMode: CloudMode.Default });
    setHighlightedFile(null);
  },
  openCloud: () => set({ showCloudWindow: true }),
  openCloudExport: (args: CloudExportArgs) => {
    set({ showCloudWindow: true, cloudMode: CloudMode.Export });
    useCloudOverlay.setState({
      onCloudExportSave: async () => {
        const { uploadFileToDrive, uploadProgress } =
          useCloudOverlay.getState().driveObject;
        const errorDesc =
          args.errorDescription ||
          "Exporting a file to your Drive resulted in an Error, please try again later. If this issue persists, please contact our support team.";
        const { closeCloud } = useNavigationOverlay.getState();
        try {
          args
            .onSave({ errorDescription: errorDesc })
            .then(async (obj: UploadObject) => {
              await uploadProgress(
                uploadFileToDrive(obj.file, undefined, obj.name, obj.type),
              );
              closeCloud();
            });
        } catch (e) {
          toast.error((e as Error).message, { description: errorDesc });
        }
      },
    });
  },
  openCloudImport: async (args: CloudImportArgs) => {
    set({ showCloudWindow: true, cloudMode: CloudMode.Import });
    useCloudOverlay.setState({
      acceptedFileTypes: args.acceptedFileTypes,
      onCloudImportSelect: async () => {
        const errorDesc =
          args.errorDescription ||
          "Importing a file from drive resulted in an Error, please try again later. If this issue persists, please contact our support team.";
        const { highlightedFile, driveObject } = useCloudOverlay.getState();
        const userId = useUser.getState().user.id;
        const { closeCloud } = useNavigationOverlay.getState();
        try {
          const file = await driveObject.getSingleFileBlob(
            highlightedFile,
            userId,
          );
          if (file) {
            args
              .onSelect({
                fileBlob: file,
                openOrigin: args.openOrigin,
                errorDescription: errorDesc,
              })
              .then(() => {
                closeCloud();
              });
          } else {
            toast.error("toast.import_file_error", { description: errorDesc });
          }
        } catch (e) {
          toast.error((e as Error).message, { description: errorDesc });
        }
      },
      onCloudImportCancel: () => {
        const { closeCloud } = useNavigationOverlay.getState();
        closeCloud();
        args.onCancel();
      },
    });
  },
  setInstitutionSettings: (data: Partial<InstitutionSettings>) =>
    set(() => ({ institutionSettings: data })),
  togglePlanner: () => set((state) => ({ showPlanner: !state.showPlanner })),
  toggleSettings: () => set((state) => ({ showSettings: !state.showSettings })),
}));

export default useNavigationOverlay;
