import React from "react";
import { TooltipProvider } from "@/src/components/reusable/shadcn-ui/tooltip";
import useChat from "../../zustand";
import CreateGroupChatModal from "./create-group-chat-modal";
import Filter from "./filter";
import SearchButton from "./search-button";

export default function ToolBar() {
  const { isSearching } = useChat();
  if (isSearching) return null;

  return (
    <TooltipProvider>
      <div className="mb-4 flex items-center space-x-3">
        <SearchButton />
        <div className="flex items-center">
          <CreateGroupChatModal />
          <Filter />
        </div>
      </div>
    </TooltipProvider>
  );
}
