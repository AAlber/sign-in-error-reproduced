import { BookMarked, LifeBuoy } from "lucide-react";
import { useIntercom } from "react-use-intercom";
import type { LearnMenuProps } from "@/src/types/learn.types";
import Divider from "../divider";
import { EmptyState } from "../empty-state";
import { Dialog } from "../shadcn-ui/dialog";
import { Content } from "./learn-content";
import { Header } from "./learn-header";
import { Item } from "./learn-item";
import { Player } from "./learn-player";
import { Section } from "./learn-section";
import { Description, Title } from "./learn-title-description";
import { Trigger } from "./learn-trigger";
import { useLearnDialog } from "./zustand";

const LearnMenu = ({
  id,
  title,
  description,
  sections,
  children = null,
}: LearnMenuProps) => {
  const { showNewMessage, showSpace } = useIntercom();
  const { focusVideo, menuStates, toggleMenu } = useLearnDialog();

  if (!sections) return null;

  return (
    <Dialog open={menuStates[id]} onOpenChange={() => toggleMenu(id)}>
      {children}
      <LearnMenu.Content key={title}>
        <LearnMenu.Header>
          <LearnMenu.Title title={title} />
          <LearnMenu.Description description={description} />
        </LearnMenu.Header>
        <Divider />
        <div className="-my-4 grid h-[422px] grid-cols-4">
          {focusVideo && (
            <div className="col-span-3 h-full">
              <LearnMenu.FocusVideo url={focusVideo} />
            </div>
          )}
          <div className="h-full overflow-y-scroll py-4">
            {sections.map((section) => {
              const { title, items } = section;
              return (
                <div className="col-span-1 flex flex-col gap-0" key={title}>
                  <LearnMenu.Section section={section} key={title}>
                    {items.map((item) => {
                      return <LearnMenu.Item props={item} key={item.title} />;
                    })}
                  </LearnMenu.Section>
                </div>
              );
            })}
            <EmptyState
              className="h-44 px-4"
              title="need_more_help"
              description="need_more_help_desc"
            />
            <div className="h-32 w-full">
              <LearnMenu.MoreHelpSection
                section={{
                  items: [],
                  type: "same-for-all",
                }}
              >
                <LearnMenu.MoreHelpItem
                  props={{
                    icon: <BookMarked className="h-5 w-5" />,
                    title: "documentation",
                    type: "action",
                    header: "article",
                    action: () => showSpace("help"),
                  }}
                />
                <LearnMenu.MoreHelpItem
                  props={{
                    icon: <LifeBuoy className="h-5 w-5" />,
                    title: "contact-support",
                    type: "action",
                    action: () => showNewMessage(),
                  }}
                />
              </LearnMenu.MoreHelpSection>
            </div>
          </div>
        </div>
      </LearnMenu.Content>
    </Dialog>
  );
};

LearnMenu.Trigger = Trigger;
LearnMenu.Header = Header;
LearnMenu.Title = Title;
LearnMenu.Content = Content;
LearnMenu.Description = Description;
LearnMenu.Section = Section;
LearnMenu.Item = Item;
LearnMenu.FocusVideo = Player;
LearnMenu.MoreHelpSection = Section;
LearnMenu.MoreHelpItem = Item;

export default LearnMenu;
