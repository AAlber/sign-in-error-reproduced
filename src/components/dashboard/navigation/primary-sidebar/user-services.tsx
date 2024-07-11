import { Search } from "lucide-react";
import useUser from "@/src/zustand/user";
import { Finder } from "./finder";
import { ItemsSection } from "./items-section";
import Notifications from "./notifications";
import PrimaryNavigationItem from "./primary-navigation-item";

export function UserServices() {
  const user = useUser((state) => state.user);

  if (!user.currentInstitutionId) return null;

  return (
    <ItemsSection>
      <Finder>
        <PrimaryNavigationItem
          hoverTitle={"spotlight"}
          icon={<Search size={18} />}
          isActive={false}
        />
      </Finder>
      <Notifications />
    </ItemsSection>
  );
}
