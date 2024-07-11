import dynamic from "next/dynamic";
import React from "react";
import ChatContextProvider from "./navigator/chat/context-provider";

// Dynamically import components with Next.js dynamic

const DialogsOverlay = dynamic(() => import("./dialogs-overlay"), {
  ssr: false,
});
const SmallBrowserWarning = dynamic(() => import("./small-browser-warning"), {
  ssr: false,
});

export const PageWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-foreground">
      <SmallBrowserWarning />
      <DialogsOverlay />
      <ChatContextProvider>{children}</ChatContextProvider>
    </main>
  );
};
