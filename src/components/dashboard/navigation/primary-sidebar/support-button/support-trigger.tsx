import { LifeBuoy } from "lucide-react";
import { useIntercom } from "react-use-intercom";
import { log } from "@/src/utils/logger/logger";
import PrimaryNavigationItem from "../primary-navigation-item";

export default function SupportButtonTrigger() {
  const { show, isOpen, hide } = useIntercom();
  const handleClick = () => {
    log.click("Support Button clicked");
    if (isOpen) {
      hide();
    } else {
      show();
    }
  };
  return (
    <PrimaryNavigationItem
      hoverTitle="support_button"
      icon={<LifeBuoy size={18} />}
      isActive={false}
      onClick={handleClick}
    />
  );
}
