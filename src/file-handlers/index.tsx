import { BookOpen, File, Folder, Music4, Video } from "lucide-react";
import Image from "next/image";
import { openWorkbenchFile } from "../client-functions/client-cloud";
import type { DownloadFileType } from "../client-functions/client-firebase";
import { downloadFirebaseFile } from "../client-functions/client-firebase";
import { downloadFileFromUrl } from "../client-functions/client-utils";
import useCloudOverlay from "../components/cloud-overlay/zustand";
import useFileViewerSheet from "../components/popups/file-viewer-sheet/zustand";
import type { WhiteboardInitialData } from "../components/reusable/page-layout/navigator/whiteboard/zustand";
import type { OnSelectArgs } from "../components/reusable/page-layout/navigator/zustand";
import useNavigationOverlay from "../components/reusable/page-layout/navigator/zustand";
import { toast } from "../components/reusable/toaster/toast";
import useWorkbench from "../components/workbench-deprecated/zustand";
import useUser from "../zustand/user";
import useFile, { OpenOrigin } from "./zustand";

function isFuxamFile(file: DownloadFileType | File): file is DownloadFileType {
  return (file as DownloadFileType).viewLink !== undefined;
}

export type EnhancedFile = {
  displayType: string;
  icon: JSX.Element;
  open: (blob?: Blob, origin?: OpenOrigin) => void;
  ending?: string;
};
//TODO: Block files being uploaded with .learn or .assess
//TODO: Make sure progress doesn't get lost when uploading a scribble with slashes for instance
export function enhanceFile({
  file,
  whiteBoard,
  openOrigin,
  link,
  secure,
}: {
  file: DownloadFileType | File;
  whiteBoard?: any;
  openOrigin: OpenOrigin;
  link?: string;
  secure?: boolean;
}): EnhancedFile {
  const type = file.type;
  const previewLink = isFuxamFile(file) ? file.viewLink : link;

  if (type.includes("audio")) {
    return getEnhancedFile({
      file: file,
      icon: <Music4 className="h-5 w-5" aria-hidden="true" />,
      displayType: "cloud.file_type_audio",
      link: previewLink!,
    });
  }
  if (type.includes("video")) {
    return getEnhancedFile({
      file: file,
      icon: <Video className="h-5 w-5" aria-hidden="true" />,
      displayType: "cloud.file_type_video",
      link: previewLink!,
    });
  }
  if (type.includes("zip") && !type.includes("epub")) {
    return getEnhancedFile({
      file: file,
      displayType: "cloud.file_type_zip",
      link: previewLink!,
    });
  }
  if (file.name.endsWith(".scribble")) {
    return getEnhancedFile({
      file: file,
      icon: (
        <Image src={"/logo.svg"} alt={""} width={64} height={64} quality={10} />
      ),
      displayType: "cloud.file_type_scribble",
      link: previewLink!,
      open: async () => {
        await handleOpenWhiteboard({ file, whiteBoard });
      },
    });
  }
  if (file.name.endsWith(".learn")) {
    return getEnhancedFile({
      file: file,
      icon: (
        <Image src={"/logo.svg"} alt={""} width={64} height={64} quality={10} />
      ),
      displayType: "cloud.file_type_learning",
      link: previewLink!,
      open: async () =>
        await handleOpenWorkbenchFile({ file: file, openOrigin: openOrigin }),
    });
  }
  if (file.name.endsWith(".assess")) {
    return getEnhancedFile({
      file: file,
      icon: (
        <Image src={"/logo.svg"} alt={""} width={64} height={64} quality={10} />
      ),
      displayType: "cloud.file_type_assessment",
      link: previewLink!,
      open: async () =>
        await handleOpenWorkbenchFile({ file: file, openOrigin: openOrigin }),
    });
  }
  if (file.type!.includes("image") && !file.type!.includes("svg")) {
    return getEnhancedFile({
      file: file,
      link: previewLink!,
      icon: (
        <Image
          src={previewLink!}
          alt={""}
          width={64}
          height={64}
          quality={10}
        />
      ),
      displayType: file.type?.split("/").pop(),
    });
  }
  switch (type) {
    case "application/pdf":
      return getEnhancedFile({
        file: file,
        displayType: "cloud.file_type_pdf",
        open: () => {
          const { initSheet } = useFileViewerSheet.getState();

          initSheet({
            fileUrl: previewLink!,
            fileName: file.name,
            secureMode: secure || false,
          });
        },
      });
    case "image/svg+xml":
      return getEnhancedFile({
        file: file,
        displayType: "cloud.file_type_svg",
      });
    case "folder":
      return getEnhancedFile({
        file: file,
        icon: <Folder className="h-5 w-5" aria-hidden="true" />,
        displayType: "cloud.file_type_folder",
        open: () => {
          return;
        },
      });
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return getEnhancedFile({
        file: file,
        icon: imgWithSrc("docx"),

        link: previewLink!,
        displayType: "cloud.file_type_word",
      });
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    case "application/vnd.ms-powerpoint":
      return getEnhancedFile({
        file: file,
        icon: imgWithSrc("ppt"),
        displayType: "cloud.file_type_powerpoint",

        link: previewLink!,
      });
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "text/csv":
    case "application/vnd.ms-excel":
      return getEnhancedFile({
        file: file,
        icon: imgWithSrc("xlsx"),
        displayType: "cloud.file_type_excel",
        link: previewLink!,
      });
    case "application/epub+zip":
      return getEnhancedFile({
        file: file,
        icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
        displayType: "cloud.file_type_ebook",
        link: previewLink!,
      });
    default:
      return getEnhancedFile({
        file: file,
        link: previewLink!,
      });
  }
}

function getEnhancedFile({
  file,
  icon,
  displayType,
  open,
  link,
}: {
  file: DownloadFileType | File;
  icon?: JSX.Element;
  displayType?: string;
  open?: (blob?: Blob) => void;
  link?: string;
}): EnhancedFile {
  const fileIcon = icon ? (
    icon
  ) : (
    <File className="h-5 w-5" aria-hidden="true" />
  );
  const fileDisplayType =
    displayType !== undefined ? displayType : "cloud.file_type_unknown";
  const fileOpen = open
    ? open
    : isFuxamFile(file)
    ? async () => {
        const { id: userId } = useUser.getState().user;
        const fileLocation = file.id.replace(`users/${userId}`, "");
        await downloadFirebaseFile("/" + fileLocation);
      }
    : async () => {
        //brokus maximales - el Leonardo Grande
        downloadFileFromUrl(file.name, link!);
      };
  return { icon: fileIcon, displayType: fileDisplayType, open: fileOpen };
}

export const handleOpenWhiteboard = async ({
  file,
  whiteBoard,
}: {
  file: DownloadFileType | File;
  whiteBoard: any;
}) => {
  const { id: userId } = useUser.getState().user;
  const { setLoaded, driveObject } = useCloudOverlay.getState();
  setLoaded(false);
  let blob: Blob;
  if (isFuxamFile(file)) {
    blob = (await driveObject.getSingleFileBlob(file, userId)) as Blob;
  } else {
    blob = file;
  }
  if (blob) {
    const text = await blob.text();
    const initialData = JSON.parse(text) as WhiteboardInitialData;
    whiteBoard.setInitialData(initialData);
    whiteBoard.setName(initialData.appState.name);
    whiteBoard.open();
  }
  setLoaded(true);
};

export const imgWithSrc = (fileName) => {
  return (
    <Image
      src={"/images/cloud/" + fileName + ".svg"}
      alt={""}
      width={64}
      height={64}
    />
  );
};

const handleOpenWorkbenchFile = async ({
  file,
  openOrigin,
}: {
  file: DownloadFileType | File;
  openOrigin: OpenOrigin;
}) => {
  const { id: userId } = useUser.getState().user;
  const { closeCloud } = useNavigationOverlay.getState();
  const { driveObject, setLoaded } = useCloudOverlay.getState();
  const { getSingleFileBlob } = driveObject;
  setLoaded(false);
  await openWorkbenchFile({
    fileBlob: isFuxamFile(file) ? await getSingleFileBlob(file, userId!) : file,
    openOrigin: openOrigin,
    fileName: file.name,
    errorDescription: "Error opening learning file",
  });
  closeCloud();
  setLoaded(true);
};

export const importWorkbenchFile = async (args: OnSelectArgs) => {
  const { fileBlob } = args;
  const { setContent } = useWorkbench.getState();
  const { setOpenedFrom } = useFile.getState();
  try {
    const text = await fileBlob.text();
    const content = JSON.parse(text.toString());
    setContent(content);
    setOpenedFrom(OpenOrigin.BlockContentEditor);
  } catch {
    toast.error("toast.file_handler_error", {
      icon: "💔",
      description: "toast.file_handler_error_description",
    });
  }
};
