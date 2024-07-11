import { MessagesSquare } from "lucide-react";
import dynamic from "next/dynamic";
import ChannelHeader from "@/src/components/reusable/page-layout/navigator/chat/channel-header";
import ChannelList from "@/src/components/reusable/page-layout/navigator/chat/channel-list";
import ChannelProvider from "@/src/components/reusable/page-layout/navigator/chat/channel-provider";
import { PageBuilder } from "../page-registry";

const ChannelInner = dynamic(
  () => import("../../../reusable/page-layout/navigator/chat/channel-inner"),
  { ssr: false },
);

const chat = new PageBuilder("CHAT")
  .withIconComponent(<MessagesSquare size={18} />)
  .withNavigationType("with-static-secondary-navigation")
  .withSecondaryNavigationElements([
    {
      id: "chat-1",
      toolbarComponent: <ChannelHeader />,
      contentComponent: (
        <ChannelProvider>
          <ChannelInner />
        </ChannelProvider>
      ),
      searchValue: "",
      tabComponent: () => <ChannelList />,
      type: "tab",
    },
  ])
  .withOptions({ searchDisabled: true, fixedSecondaryNavigation: true })
  .build();

export { chat };
