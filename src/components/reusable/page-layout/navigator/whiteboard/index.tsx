import type { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import type {
  ExcalidrawAPIRefValue,
  ExcalidrawImperativeAPI,
  ExcalidrawProps,
} from "@excalidraw/excalidraw/types/types";
import debounce from "lodash/debounce";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useCloudOverlay from "../../../../cloud-overlay/zustand";
import SlideUpTransition from "./slide-up-transition";
import useWhiteBoard from "./zustand";

const Whiteboard = () => {
  const {
    initialData,
    isDirty,
    name,
    close,
    setIsDirty,
    setIsSafeToRefetchFiles,
    setIsSaving,
    setName,
  } = useWhiteBoard();

  const { uploadFileToDrive } = useCloudOverlay().driveObject;

  const [isMounted, setIsMounted] = useState(false);
  const [E, setExcalidrawLib] = useState<any>();
  const [Excalidraw, setExcalidraw] =
    useState<
      React.MemoExoticComponent<
        React.ForwardRefExoticComponent<
          ExcalidrawProps & React.RefAttributes<ExcalidrawAPIRefValue>
        >
      >
    >();
  const excalidrawRef = useRef<ExcalidrawImperativeAPI>(null);
  const initElements = useRef<ExcalidrawElement[]>(
    initialData.elements as ExcalidrawElement[],
  );

  const handleOnChange = useCallback(
    debounce(() => {
      const el = excalidrawRef.current?.getSceneElements();
      if (!el) return;
      if (!el.length) {
        setIsDirty(false);
        initElements.current = [];
        return;
      }

      if (isDirty || initElements.current.length === el.length) return;
      setIsDirty(true);
    }, 500),
    [isDirty],
  );

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const excalidrawProps: ExcalidrawProps = {
    initialData: {
      elements: initialData.elements,
      appstate: E?.restoreAppState(initialData.appState),
      scrollToContent: true,
    },
    name: initialData.appState.name ?? name,
    theme: isDark ? "dark" : "light",
    onChange: handleOnChange,
  };

  useEffect(() => {
    setIsMounted(true);
    import("@excalidraw/excalidraw").then((component) => {
      const { Excalidraw, ...restOfLib } = component;
      setExcalidraw(Excalidraw);
      setExcalidrawLib(restOfLib);
      setTimeout(() => {
        excalidrawRef.current?.updateScene({
          // this is the offset of the top bar
          appState: {
            offsetTop: 48,
            zenModeEnabled: true,
            contextMenu: null,
          },
        });
      }, 300);
    });
  }, []);

  const handleSave = async (fname?: string) => {
    if (fname) setName(fname);
    const elements = excalidrawRef.current?.getSceneElements();
    const appState = excalidrawRef.current?.getAppState();
    if (elements) {
      const obj = {
        elements,
        appState,
      };

      try {
        setIsSaving(true);
        const json = createJsonBackup(obj);
        const filename = generateFilename(fname ?? name);

        await uploadFileToDrive(
          json,
          undefined,
          `${filename}.scribble`,
          "scribble",
        );

        setIsSafeToRefetchFiles(true);

        const el = excalidrawRef.current?.getSceneElements();
        if (initElements?.current && el) {
          initElements.current = [...el];
          setIsDirty(false);
        }
        setIsMounted(false);
        setTimeout(() => {
          close();
        }, 300);
      } catch (e) {
        console.log(e);
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (!Excalidraw || !E) return null;
  return (
    <SlideUpTransition
      show={isMounted}
      setIsMounted={setIsMounted}
      onSave={handleSave}
    >
      <Excalidraw ref={excalidrawRef} {...excalidrawProps} />
    </SlideUpTransition>
  );
};

export default Whiteboard;

function createJsonBackup(obj: object) {
  const json = JSON.stringify(obj);
  const blob = new Blob([json], { type: "application/json" });
  const file = new File([blob], "scribble.json");
  return file;
}

function generateFilename(name?: string) {
  if (!name || name.trim().toLowerCase() === "untitled") {
    return `Untitled-${new Date().getTime()}`;
  }

  return name.trim().replaceAll(" ", "-");
}
