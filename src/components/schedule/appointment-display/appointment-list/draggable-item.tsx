import { useDraggable } from "@dnd-kit/core";
import React, { useEffect, useMemo, useState } from "react";
import { round5 } from "@/src/client-functions/client-schedule/drag-and-drop";
import classNames from "@/src/client-functions/client-utils";
import { useUserOverview } from "@/src/components/reusable/user-overview-sheet/zustand";
import useSchedule from "../../zustand";
import { MINUTE_INTERVALS_IN_HOUR } from "../config";
import { useCalendarDrag } from "../zustand";
import styles from "./drag.module.css";
import ResizeHandler from "./resize-handler";

export function DraggableItem({
  style,
  id,
  children,
  metadata,
}: React.PropsWithChildren<DraggableProps>) {
  const { canCreate, fullScreenView } = useSchedule();
  const [
    containerRect,
    draggingDisabled,
    isResizing,
    setIsOverDraggable,
    setIsResizing,
    setNewDuration,
  ] = useCalendarDrag((state) => [
    state.containerRect,
    state.draggingDisabled,
    state.isResizing,
    state.setIsOverDraggable,
    state.setIsResizing,
    state.setNewDuration,
  ]);

  const userOverViewOpen = useUserOverview((state) => state.open);

  const {
    isDragging,
    transform,
    listeners,
    activeNodeRect,
    setNodeRef,
    setActivatorNodeRef,
  } = useDraggable({
    id,
    disabled: draggingDisabled || !canCreate || fullScreenView !== "week",
    data: {
      appointmentType: metadata.appointmentType,
      originalDateTime: metadata.originalDateTime,
      originalDuration: metadata.originalDuration,
    } satisfies AppointmentDraggableMetadata,
  });

  const [initHeight, setInitHeight] = useState<number>();

  useEffect(() => {
    // minus 5 offset
    if (activeNodeRect?.height) setInitHeight(activeNodeRect.height - 5);
  }, [activeNodeRect?.height]);

  useEffect(() => {
    const reset = () => {
      setTimeout(() => {
        setInitHeight(undefined);
        setNewDuration(0);
        setIsResizing(false);
      }, 50);
    };

    document.addEventListener("mouseup", reset);
    return () => document.removeEventListener("mouseup", reset);
  }, []);

  const computedHeight = useMemo(() => {
    if (!transform?.y || !initHeight) return;
    return Math.max(Math.floor(transform.y + initHeight), 20);
  }, [transform?.y, initHeight]);

  useEffect(() => {
    if (!computedHeight || !containerRect) return;
    const duration =
      Math.floor(computedHeight / containerRect.rowHeight) *
      MINUTE_INTERVALS_IN_HOUR;

    // derived through trial and error
    const EXPERIMENTAL_OFFSET = 10;
    setNewDuration(Math.ceil(duration + EXPERIMENTAL_OFFSET));
  }, [computedHeight]);

  return (
    <li
      id={id}
      className={classNames(
        styles.Draggable,
        isDragging && !isResizing && styles.dragging,
        "fixed flex cursor-pointer",
      )}
      onMouseEnter={() => setIsOverDraggable(true)}
      onMouseLeave={() => setIsOverDraggable(false)}
      style={
        {
          ...style,
          ...(isResizing && computedHeight
            ? {
                "--height": `${round5(computedHeight)}px`,
              }
            : {
                "--translate-x": `${transform?.x ?? 0}px`,
                "--translate-y": `${transform?.y ?? 0}px`,
              }),
        } as React.CSSProperties
      }
      {...listeners}
      ref={setNodeRef}
    >
      {children}
      {!userOverViewOpen && fullScreenView === "week" && (
        <ResizeHandler
          setIsResizing={setIsResizing}
          ref={setActivatorNodeRef}
        />
      )}
    </li>
  );
}

export type DraggableProps = {
  style?: React.CSSProperties;
  id: string;
  metadata: AppointmentDraggableMetadata;
};

export type AppointmentDraggableMetadata = {
  appointmentType: "draft" | "regular";
  originalDateTime: Date;
  originalDuration: number;
};
