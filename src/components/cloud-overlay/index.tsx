import { GoogleOAuthProvider } from "@moeindana/google-oauth";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import {
  getSubpath,
  isNotInLastFour,
} from "../../client-functions/client-firebase";
import classNames from "../../client-functions/client-utils";
import { withPortal } from "../portal";
import useNavigationOverlay, {
  CloudMode,
} from "../reusable/page-layout/navigator/zustand";
import ActionButton from "./action-button";
import CloudAddButton from "./add-button.tsx";
import FileView from "./file-view";
import useCloudOverlay from "./zustand";

function CloudOverlay() {
  const { closeCloud, cloudMode } = useNavigationOverlay();
  const { setLoaded, onCloudImportCancel, driveObject } = useCloudOverlay();
  const [dragWindowEnabled, setDragWindowEnabled] = useState(false);
  const { path, lastFolder, setLastFolder, setPath, getParentPath } =
    driveObject;
  const backAvailable = path !== "";
  const forwardAvailable = lastFolder !== null;
  const splitPath: string[] = path.split("/");
  const { t } = useTranslation("page");

  return (
    // TODO: this one handles the scope and clienId that returns the code for login google, need to consult if we could make it outside the _app.ts
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <div className="pointer-events-none absolute flex h-full w-full items-center justify-center">
        <Draggable disabled={!dragWindowEnabled} bounds="parent">
          <main className="pointer-events-auto z-50 select-none ">
            <div className="overflow-hidden rounded-md border  border-border bg-background shadow-lg  ">
              <div className="flex h-[460px] w-[600px] flex-col lg:w-[850px]">
                <div
                  onPointerEnter={() => setDragWindowEnabled(true)}
                  onPointerLeave={() => setDragWindowEnabled(false)}
                  className="flex w-full cursor-grab items-center justify-between border-b  border-border bg-background px-2"
                >
                  <div className="flex select-none items-center gap-1 py-2 font-medium text-contrast">
                    <X
                      onClick={() => {
                        closeCloud();
                        if (cloudMode === CloudMode.Import) {
                          onCloudImportCancel();
                        }
                      }}
                      className="mr-1 h-6 w-6 cursor-pointer text-contrast"
                    />
                    <ChevronLeft
                      data-testid="go-backward-folder"
                      onClick={() => {
                        if (backAvailable) {
                          setLoaded(false);
                          setLastFolder && setLastFolder(path);
                          const parentFolder = getParentPath(path);
                          setPath && setPath(parentFolder);
                        }
                      }}
                      className={classNames(
                        backAvailable ? "opacity-100" : "opacity-50",
                        "h-5 w-auto cursor-pointer text-contrast lg:h-6",
                      )}
                    />
                    <ChevronRight
                      data-testid="go-forward-folder"
                      onClick={() => {
                        if (forwardAvailable) {
                          setLoaded(false);
                          lastFolder !== null && setPath && setPath(lastFolder);
                          setLastFolder && setLastFolder(null);
                        }
                      }}
                      className={classNames(
                        forwardAvailable ? "opacity-100" : "opacity-50",
                        "h-5 w-auto cursor-pointer text-contrast lg:h-6",
                      )}
                    />
                    {/**
                     * PLUS BUTTON
                     * ADD FILES
                     */}
                    {cloudMode !== CloudMode.Import && <CloudAddButton />}
                    {cloudMode === CloudMode.Import ? (
                      <div className="text-sm  text-muted-contrast">
                        {t("cloud.import_files")}
                      </div>
                    ) : (
                      <div className="text-sm  text-offwhite-2">
                        {splitPath.length > 4 ? "..." : ""}
                        {splitPath.map((folder, idx) => {
                          if (
                            splitPath.length > 4 &&
                            isNotInLastFour(splitPath, folder)
                          )
                            return;
                          if (isLastElement(folder, splitPath)) {
                            return (
                              <a key={idx} className="mx-2  opacity-70">
                                {folder}
                              </a>
                            );
                          } else {
                            return (
                              <>
                                <a
                                  key={idx}
                                  className="mx-2 cursor-pointer underline"
                                  onClick={() => {
                                    setPath &&
                                      setPath(getSubpath(path, folder));
                                    setLastFolder && setLastFolder(path);
                                  }}
                                >
                                  {" "}
                                  {folder}
                                </a>{" "}
                                /{" "}
                              </>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-x-1">
                    {/* <ProviderSelector /> */}
                    <ActionButton />
                  </div>
                </div>
                <ProgressbarUpload />
                <FileView />
              </div>
            </div>
          </main>
        </Draggable>
      </div>
    </GoogleOAuthProvider>
  );
}

function ProgressbarUpload() {
  const { uploadStep } = useCloudOverlay();
  let uploadPercent: number | undefined = 0;
  const loadingSteps: number[] = [20, 40, 60, 80, 90, 97];

  if (uploadStep !== null) {
    uploadPercent = loadingSteps[uploadStep];
  }

  if (uploadStep === null) return null;
  return (
    <>
      <div className="" aria-hidden="true">
        <div className="overflow-hidden bg-transparent">
          <div
            className="h-[1px] bg-fuxam-pink transition-all duration-500 ease-in-out"
            style={{ width: `${uploadPercent}%` }}
          />
        </div>
      </div>
    </>
  );
}
function isLastElement(element: string, array: string[]) {
  if (array.length < 2) {
    return true;
  }
  if (element == array[array.length - 1]) return true;
  return element == array[array.length - 2];
}

function CloudWithContainer() {
  return (
    <div className="absolute inset-0 z-[50] flex items-center justify-center">
      <CloudOverlay />
    </div>
  );
}

export default withPortal(CloudWithContainer);
