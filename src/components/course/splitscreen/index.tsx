import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useDrive,
  useDynamicDrive,
} from "@/src/client-functions/client-cloudflare/hooks";
import { useDriveCopyPaste } from "@/src/client-functions/client-drive/hooks";
import classNames from "@/src/client-functions/client-utils";
import { courseGradients } from "@/src/utils/theming";
import useUser from "@/src/zustand/user";
import { Dimensions } from "../../dashboard/dimensions";
import { useUserDriveModal } from "../../dashboard/navigation/primary-sidebar/user-drive/zustand";
import Drive from "../../drive";
import { useCourseDriveUploader } from "../../reusable/file-uploaders/zustand";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../reusable/shadcn-ui/tabs";
import Skeleton from "../../skeleton";
import CourseInfo from "../info";
import BannerPicker from "../info/banner-picker";
import { EmojiIcon } from "../info/emoji-settings";
import Lobby from "../lobby";
import useCourse from "../zustand";
import { CourseStorageStatus } from "./course-storage-status";

const CourseSplitScreen = () => {
  const { t } = useTranslation("page");
  const { user } = useUser();
  const { courseTabChangeLoading } = useCourse();
  const [sidebarTab, setSidebarTab] = useState<"info" | "chat" | "drive">(
    "info",
  );
  const drive = useDrive();

  const {
    folderBeingDraggedOver,
    setIsDriveBeingDraggedOver,
    setIdsBeingUploaded,
  } = useDynamicDrive();
  useDriveCopyPaste();

  const { setFocusedDrive } = useUserDriveModal();
  const handleDrop = useCallback(
    (e) => {
      if (folderBeingDraggedOver === "") {
        e.preventDefault();
        e.stopPropagation();

        setIsDriveBeingDraggedOver(false);
        drive.client.handle.drop(e);
      }
    },
    [drive.client],
  );
  const { setUppy } = useCourseDriveUploader();
  const { course } = useCourse();

  useEffect(() => {
    setUppy(undefined);
    setIdsBeingUploaded([]);
  }, [course.layer_id]);

  return (
    <div className="size-full bg-background">
      <div
        style={{
          height: Dimensions.Navigation.Toolbar.Height,
        }}
        className="flex items-center bg-background p-4"
      >
        <h3 className="font-medium">About this course</h3>
      </div>
      <div className="relative flex flex-col">
        <div className="relative overflow-hidden rounded-lg px-4">
          <div
            className={classNames(
              "group relative flex !h-32 w-full justify-center overflow-hidden rounded-lg bg-gradient-to-tr p-2",
              courseGradients[course?.color ?? 0]?.gradient,
            )}
          >
            {course?.bannerImage && (
              <>
                <Image
                  src={course?.bannerImage}
                  className="absolute inset-0 size-full object-cover object-center"
                  fill
                  priority
                  alt="Banner image"
                />
                <div className="absolute inset-0 -z-10 size-full">
                  <Skeleton />
                </div>
              </>
            )}

            <div className="absolute right-4 top-4 z-20 w-52">
              <BannerPicker />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 left-6 size-28">
          <EmojiIcon />
        </div>
      </div>
      <div className="flex px-6 pt-10">
        <div className="flex w-full flex-col items-start">
          <h1 className="text-2xl font-bold leading-7 text-contrast">
            {course?.name}
          </h1>
        </div>
      </div>
      <Tabs
        defaultValue={"schedule"}
        value={sidebarTab}
        onValueChange={(tab) => setSidebarTab(tab as any)}
        className="size-full"
      >
        <div className="flex h-[55px] items-center p-2">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="schedule">
              {t("schedule")}
            </TabsTrigger>
            {user.institution?.institutionSettings
              .communication_course_chat && (
              <TabsTrigger className="w-full" value="chat">
                {t("chat")}
              </TabsTrigger>
            )}

            <div className="w-full">
              <TabsTrigger className="w-full" value="drive">
                {t("drive")}
              </TabsTrigger>
            </div>
          </TabsList>
        </div>
        {courseTabChangeLoading ? (
          <Skeleton />
        ) : (
          <>
            <TabsContent value="schedule" className="h-[calc(100%-55px)]">
              <CourseInfo />
            </TabsContent>

            <TabsContent
              value="chat"
              className="h-[calc(100%-315px)] w-full overflow-hidden"
            >
              <Lobby />
            </TabsContent>

            <TabsContent
              value="drive"
              className={classNames(
                drive.client.get.hasWriteAccess() && "h-full",
                "flex h-full flex-col justify-between",
              )}
              onFocus={() => {
                setFocusedDrive("course-drive");
              }}
              onDrop={handleDrop}
              onBlur={() => {
                setFocusedDrive(undefined);
              }}
            >
              <div
                className={classNames(
                  drive.client.get.hasWriteAccess() &&
                    "max-h-[calc(100%-150px)] basis-4/5",
                  "!h-full",
                )}
              >
                <Drive className="h-full" />
              </div>
              {drive.client.get.hasWriteAccess() && <CourseStorageStatus />}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};
CourseSplitScreen.displayName = "CourseSplitScreen";

export { CourseSplitScreen };
