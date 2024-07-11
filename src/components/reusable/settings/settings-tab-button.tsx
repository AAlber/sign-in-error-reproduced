import { useTranslation } from "react-i18next";
import { toastComingSoon } from "@/src/client-functions/client-utils";
import { Button } from "../shadcn-ui/button";
import { NavigationMenuItem } from "../shadcn-ui/navigation-menu";

export default function SettingsTabButton(
  props: SettingsTabButton & { setActiveTab: (id: number) => void },
) {
  const { t } = useTranslation("page");

  return (
    <NavigationMenuItem
      onClick={() => {
        if (props.comingSoon) return toastComingSoon();
        return props.setActiveTab(props.id);
      }}
    >
      <Button size={"lg"} variant={"ghost"}>
        {" "}
        <div className="flex items-center gap-2">
          <span className="text-muted-contrast">{props.icon}</span>
          {t(props.name)}
        </div>
      </Button>
    </NavigationMenuItem>
  );
}
