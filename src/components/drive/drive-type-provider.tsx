import type { ReactNode } from "react";
import { createContext } from "react";
import type { DriveTypes } from "@/src/types/storage.types";

export const DriveTypeContext = createContext<DriveTypes>("course-drive");

export const DriveTypeProvider: React.FC<{
  children: ReactNode;
  driveType: DriveTypes;
}> = ({ children, driveType }) => (
  <DriveTypeContext.Provider value={driveType}>
    {children}
  </DriveTypeContext.Provider>
);
