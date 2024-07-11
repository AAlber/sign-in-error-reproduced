import { useTranslation } from "react-i18next";
import { Button } from "../shadcn-ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../shadcn-ui/hover-card";
import { ListItem } from "../shadcn-ui/navigation-menu";

export default function SettingsTabMenu(
  props: SettingsTabMenu & { setActiveTab: (id: number) => void },
) {
  const { t } = useTranslation("page");
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger onClick={() => props.setActiveTab(props.id)}>
        <Button
          size={"lg"}
          variant={"ghost"}
          className="flex items-center gap-2 text-sm"
        >
          <span className="text-muted-contrast">{props.icon}</span>
          {t(props.name)}
        </Button>{" "}
      </HoverCardTrigger>
      <HoverCardContent>
        <ul className="grid gap-1">
          {props.tabs.map((tab) => (
            <ListItem
              key={tab.id}
              title={t(tab.name)}
              onClick={() => props.setActiveTab(tab.id)}
            ></ListItem>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
