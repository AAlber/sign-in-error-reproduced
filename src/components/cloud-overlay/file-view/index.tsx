import {
  hasGrantedAllScopesGoogle,
  useGoogleLogin,
} from "@moeindana/google-oauth";
import Image from "next/image";
import { useCallback, useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import cookie from "react-cookies";
import { useTranslation } from "react-i18next";
import useDragObject from "../../../zustand/dragged-object";
import useUser from "../../../zustand/user";
import Button from "../../reusable/new-button";
import useWhiteBoard from "../../reusable/page-layout/navigator/whiteboard/zustand";
import Spinner from "../../spinner";
import type { GoogleDrive } from "../classes/google-drive";
import { googleTokenValidation } from "../classes/google-drive";
import FileListItem from "../file";
import useCloudOverlay from "../zustand";
import FileViewTableBody from "./table-body";
import FileViewTableHead from "./table-head";

export default function FileView() {
  const {
    drive,
    googleIsValid,
    driveObject,
    isLoaded,
    files,
    setLoaded,
    setGoogleIsValid,
  } = useCloudOverlay();
  const userId = useUser((state) => state.user).id;
  const whiteBoard = useWhiteBoard();
  const { data } = useDragObject();
  const { t } = useTranslation("page");

  const { path, loadFiles, getFileId } = driveObject;
  let googleFileId;
  let GOOGLE_SCOPES;

  try {
    if (drive.id === 1) {
      GOOGLE_SCOPES = (driveObject as GoogleDrive).GOOGLE_SCOPES;
      googleFileId = getFileId(path);
    }
  } catch (e) {
    console.log(e);
  }

  useEffect(() => {
    const obj = JSON.parse(JSON.stringify(data));
    const dataArray = Object.entries(obj).flat();

    // if (dataArray[0] !== "" && dataArray[1] !== "" && runDragIntoFolder) {

    // setDisabledFolders([...disabledFolders, dataArray[0] as string ])
    // runDragIntoFolder(dataArray[0] as string, dataArray[1] as string, files).then(() => {
    //   removeDisabledFolder(dataArray[0] as string)
    // });
    // }
  }, [data]);

  useEffect(() => {
    if (whiteBoard.isSafeToRefetchFiles) {
      loadFilesCallback().then(() => {
        console.log("Scribbles refetched");
      });
      return;
    }
    loadFilesCallback();
  }, [driveObject, path, whiteBoard.isSafeToRefetchFiles]);

  const loadFilesCallback = useCallback(async () => {
    setLoaded(false);
    try {
      if (drive.id === 0) {
        await loadFiles({ loadPathOrFileId: path });
        setLoaded(true);
        return;
      }
      if (drive.id === 1) {
        await googleTokenValidation(setGoogleIsValid);
        setTimeout(async () => {
          await loadFiles({ loadPathOrFileId: await googleFileId });
          setTimeout(() => setLoaded(true), 700);
        }, 100);
        return;
      }
    } catch (e) {
      console.log(e);
    } finally {
      // we can setLoaded(true) here
    }
  }, [path, userId, driveObject]);

  /**
   * ===============
   * GET GOOGLE CODE
   * ===============
   **/
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await cookie.remove("google_access_token");
      await cookie.save("google_access_token", tokenResponse?.access_token, {
        path: "/",
      });
      loadFiles && (await loadFiles({ loadPathOrFileId: await googleFileId }));

      const hasAccess = hasGrantedAllScopesGoogle(
        tokenResponse,
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.readonly",
      );

      console.log("granted access: ", hasAccess);

      setGoogleIsValid(true);
    },
    onError: async (errorResponse) => {
      console.log(errorResponse);
      setGoogleIsValid(false);
      await cookie.remove("google_access_token");
    },
    scope: GOOGLE_SCOPES,
  });

  /**
   * ===========================
   * GOOGLE CONDITION FOR SINGIN
   * ===========================
   **/

  // TO DO if user dont have a files after login stil showing the login
  if (drive.id === 1 && !googleIsValid && isLoaded) {
    return (
      <section className="my-auto flex flex-col items-center justify-center px-10 text-center">
        <Image
          src="/illustrations/drive-signin.webp"
          className="h-36 w-36"
          width={256}
          height={256}
          priority
          alt="Google drive sign in"
        />
        <h2 className="text-2xl font-bold text-contrast">
          Connect your Google Drive
        </h2>
        <p className="mb-4 text-muted-contrast">
          Sign in with your Google account to access your files.
        </p>
        <Button onClick={() => login} title="Connect" loading={false} />
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <div className="my-auto flex flex-col items-center justify-center px-10">
        <Spinner size={"50"} />
      </div>
    );
  }

  if (
    (isLoaded && drive.id === 1 && !files.length && googleIsValid) ||
    (drive.id === 0 && files.length === 0 && isLoaded)
  ) {
    return (
      <section className="my-auto flex flex-col items-center justify-center px-10 text-center">
        <h2 className="text-sm text-muted-contrast">{t("cloud.no_files")}</h2>
      </section>
    );
  }

  /** =============================== **/

  return (
    <Droppable
      droppableId="droppable"
      direction="vertical"
      isCombineEnabled
      renderClone={(provided, snapshot, rubric) => {
        const file = files[rubric.source.index];
        return (
          <FileListItem
            file={file}
            fileIdx={file.id}
            files={files}
            provided={provided}
          />
        );
      }}
    >
      {(provided) => (
        <div className="flow-root min-h-[460px] overflow-y-scroll">
          <div className="-my-2">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="mb-20 min-w-full border-separate border-spacing-0">
                <FileViewTableHead />
                <FileViewTableBody files={files} provided={provided} />
              </table>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
}
