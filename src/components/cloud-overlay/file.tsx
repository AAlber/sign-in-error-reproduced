import dayjs from "dayjs";
import { ArrowDown, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DownloadFileType } from "@/src/client-functions/client-firebase";
import confirmAction from "@/src/client-functions/client-options-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import { enhanceFile } from "@/src/file-handlers";
import { OpenOrigin } from "@/src/file-handlers/zustand";
import useUser from "@/src/zustand/user";
import {
  convertToKilobytesOrMegabytes,
  removeDisabledFolder,
} from "../../client-functions/client-cloud";
import classNames from "../../client-functions/client-utils";
import useInputModal from "../popups/input-modal/zustand";
import useWhiteBoard from "../reusable/page-layout/navigator/whiteboard/zustand";
import useNavigationOverlay, {
  CloudMode,
} from "../reusable/page-layout/navigator/zustand";
import { ScribbleIcon } from "./add-button.tsx/item-scribble";
import useCloudOverlay from "./zustand";

export default function FileListItem({ file, fileIdx, files, provided }) {
  const { user } = useUser();
  dayjs.locale(user.language);
  const {
    drive,
    currentPath,
    googlePath,
    driveObject,
    highlightedFile,
    acceptedFileTypes,
    setLoaded,
    setHighlightedFile,
    onCloudImportSelect,
    setDisabledFolders,
    disabledFolders,
  } = useCloudOverlay();
  const { cloudMode } = useNavigationOverlay();
  const {
    setLastFolder,
    uploadProgress,
    setPath,
    downloadFile,
    renameFileOrFolder,
    deleteFileOrFolder,
    downloadFolder,
    path,
    isFolder,
  } = driveObject;

  const isAcceptedFile = (file: DownloadFileType) => {
    return acceptedFileTypes.length === 0
      ? true
      : acceptedFileTypes.includes(file.type);
  };
  const disabledItem =
    (file.type !== "folder" && cloudMode === CloudMode.Export) ||
    (file.type !== "folder" &&
      !isAcceptedFile(file) &&
      cloudMode === CloudMode.Import) ||
    disabledFolders.includes(file.id);

  const isHighlightedFile = highlightedFile?.id === file.id;

  const userId = useUser().user!.id;

  const whiteBoard = useWhiteBoard();

  const { t } = useTranslation("page");

  const initNewFolderModal = useInputModal((state) => state.initModal);

  const enhancedFile = enhanceFile({
    file: file,
    whiteBoard: whiteBoard,
    openOrigin: OpenOrigin.Cloud,
  });
  const handleClick = async (event: any) => {
    const folder = isFolder(file);

    if (event.detail === 1) {
      if (folder) {
        setLoaded(false);
        if (setLastFolder && setPath) {
          setLastFolder(null);
          const newPath =
            drive.id === 0
              ? currentPath + file.name + "/"
              : googlePath + file.id + "/";
          setPath(newPath);
        }
      } else {
        setHighlightedFile(file);
      }
    } else if (event.detail === 2) {
      if (cloudMode === CloudMode.Import) {
        onCloudImportSelect();
      } else {
        enhancedFile.open();
      }
    }
  };

  return (
    <tr
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={classNames(
        disabledItem ? "pointer-events-none opacity-50" : "",
        isHighlightedFile ? "bg-primary" : "hover:bg-secondary",
      )}
    >
      <td
        onClick={(event) => handleClick(event)}
        className={classNames(
          fileIdx !== files.length - 1 ? "border-b border-border" : "",
          "w-3 whitespace-nowrap pl-5 text-sm font-medium text-muted-contrast",
        )}
      >
        {enhancedFile.icon}
      </td>
      <td
        onClick={(event) => handleClick(event)}
        className={classNames(
          fileIdx !== files.length - 1 ? "border-b border-border" : "",
          "max-w-[350px] overflow-hidden whitespace-nowrap px-4 py-4 text-sm font-medium text-contrast",
        )}
      >
        {file.name}
      </td>
      <td
        onClick={(event) => handleClick(event)}
        className={classNames(
          fileIdx !== files.length - 1 ? "border-b border-border" : "",
          "table-cell whitespace-nowrap px-3 py-4 text-sm text-muted-contrast",
        )}
      >
        {isFolder(file) ? "" : convertToKilobytesOrMegabytes(file.size)}
      </td>
      <td
        onClick={(event) => handleClick(event)}
        className={classNames(
          fileIdx !== files.length - 1 ? "border-b border-border" : "",
          "table-cell max-w-[100px] overflow-hidden whitespace-nowrap px-3 py-4 text-sm text-muted-contrast",
        )}
      >
        {t(enhancedFile.displayType)}
      </td>
      <td
        onClick={(event) => handleClick(event)}
        className={classNames(
          fileIdx !== files.length - 1 ? "border-b border-border" : "",
          "table-cell whitespace-nowrap px-3 py-4 text-sm text-muted-contrast",
        )}
      >
        {file.lastModified
          ? dayjs(file.lastModified).format("DD. MMM YYYY")
          : ""}
      </td>
      <td
        className={classNames(
          fileIdx !== files.length - 1 ? "border-b border-border" : "",
          "relative whitespace-nowrap py-4 pr-4 text-right text-sm font-medium",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal
              data-testid="file-button-options"
              className="h-5 w-5 cursor-pointer self-end text-muted-contrast hover:opacity-60"
              aria-hidden="true"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="mr-3 w-[165px] opacity-100 !shadow-none focus:outline-none"
          >
            <DropdownMenuGroup>
              {/* **** DONWLOAD MENU OPTION **** */}
              {file.type !== "folder" ? (
                <DropdownMenuItem
                  onClick={async () => {
                    if (file.type === "folder") {
                      downloadFolder(
                        drive.id === 0
                          ? currentPath + file.name + "/"
                          : file.id,
                        file.name,
                      );
                    } else {
                      await uploadProgress(downloadFile(file.id));
                    }
                  }}
                  className="flex w-full px-2 "
                >
                  <ArrowDown className="mr-3 h-4 w-4 text-contrast" />
                  <span
                    data-testid="file-button-download"
                    className="text-sm text-contrast"
                  >
                    {t("cloud.file_options_download")}
                  </span>
                </DropdownMenuItem>
              ) : (
                <></>
              )}

              {/* **** RENAME MENU OPTION **** */}
              <DropdownMenuItem
                onClick={() =>
                  initNewFolderModal({
                    title: `Rename a ${isFolder(file) ? "Folder" : "File"}`,
                    description: `What would you like to name the ${
                      isFolder(file) ? "folder" : "file"
                    } called ${file.name}?`,
                    action: "Save",
                    name: "",
                    specialCharactersAllowed: false,
                    onConfirm: async (name) => {
                      const isFile = !isFolder(file);
                      !isFile &&
                        setDisabledFolders([...disabledFolders, file.id]);
                      await renameFileOrFolder(
                        file.id,
                        file.name,
                        name,
                        isFile ? file.type : undefined,
                      );
                      removeDisabledFolder(file.id);
                    },
                  })
                }
                className="flex w-full px-2 "
              >
                <Edit2 className="mr-3 h-3 w-4 text-contrast" />
                <span
                  data-testid="file-button-rename"
                  className="text-sm text-contrast"
                >
                  {t("cloud.file_options_rename")}
                </span>
              </DropdownMenuItem>

              {/* **** SCRIBLE MENU OPTION **** */}
              {file.name.endsWith(".scribble") && file.type !== "folder" && (
                <DropdownMenuItem
                  onClick={() => enhancedFile.open()}
                  className="flex w-full px-2 "
                >
                  <ScribbleIcon />
                  <span
                    data-testid="file-button-scribble"
                    className="text-sm text-contrast"
                  >
                    {t("cloud.file_options_open")}
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* **** DELETE MENU OPTION **** */}
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={async () =>
                  confirmAction(
                    async () => {
                      setTimeout(() => {
                        deleteFileOrFolder(file);
                      }, 0);
                    },
                    {
                      title: `${t("general.delete")} ${
                        isFolder(file)
                          ? t("cloud.confirm_action_delete_file_title2")
                          : t("cloud.confirm_action_delete_file_title3")
                      }`,
                      description: `${t(
                        "cloud.confirm_action_delete_file_description1",
                      )} ${
                        isFolder(file)
                          ? t("cloud.confirm_action_delete_file_description2")
                          : t("cloud.confirm_action_delete_file_description3")
                      } ${t("cloud.confirm_action_delete_file_description4")} ${
                        file.name
                      }?`,
                      actionName: "general.delete",
                      dangerousAction: true,
                    },
                  )
                }
                className="flex w-full px-2 "
              >
                <Trash2 className="mr-3 h-4 w-4 text-contrast" />
                <span
                  data-testid="file-button-delete"
                  className="text-sm text-contrast"
                >
                  {t("general.delete")}
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
