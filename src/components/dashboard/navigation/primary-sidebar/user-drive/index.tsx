import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { useDriveCopyPaste } from "@/src/client-functions/client-drive/hooks";
import { delay } from "@/src/client-functions/client-utils";
import Drive from "@/src/components/drive";
import { useUserDrive } from "@/src/components/drive/zustand";
import { useUserDriveModal } from "./zustand";

function UserDrive() {
  const { open, headerDragEnabled, setIsDraggingDrive, setFocusedDrive } =
    useUserDriveModal();

  const { currentlyDragging } = useUserDrive();

  const [isDraggingDirectories, setIsDraggingDirectories] = useState(false);
  useEffect(() => {
    if (currentlyDragging === "") {
      delay(500).then(() => setIsDraggingDirectories(false));
    } else {
      setIsDraggingDirectories(true);
    }
  }, [currentlyDragging]);

  const { handlePaste, handleCopy } = useDriveCopyPaste();
  return open ? (
    <div
      tabIndex={-100}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div
        style={{
          cursor: isDraggingDirectories ? "grabbing" : "grab",
        }}
        className="absolute flex h-full w-full items-center justify-center"
      >
        <Draggable
          disabled={!headerDragEnabled || currentlyDragging !== ""}
          onStart={() => setIsDraggingDrive(true)}
          onStop={() => setIsDraggingDrive(false)}
          bounds="parent"
        >
          <main className="pointer-events-auto z-[1000000000] select-none rounded-md bg-foreground">
            <div className="z-[1000000000] overflow-hidden rounded-md  border border-border bg-background shadow-lg  ">
              <div
                tabIndex={0}
                className="flex h-[460px] w-[600px] flex-col lg:w-[850px]"
                onClick={() => {
                  setFocusedDrive("user-drive");
                }}
                onBlur={() => {
                  setFocusedDrive(undefined);
                }}
              >
                <Drive className={"!h-[400px]"} />
              </div>
            </div>
          </main>
        </Draggable>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default UserDrive;
