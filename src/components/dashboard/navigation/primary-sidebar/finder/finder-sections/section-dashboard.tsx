import { ListTree, Settings, Shapes, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import useUser from "@/src/zustand/user";
import { useNavigation } from "../../../zustand";
import FinderSection from "../finder-section";
import useFinder from "../zustand";

export default function SectionDashboard() {
  const { t } = useTranslation("page");
  const { setPage: setPageZustand } = useNavigation();
  const { setOpen } = useFinder();
  const { user } = useUser();

  function setPage(page: PageKey) {
    setPageZustand(page);
    setOpen(false);
  }

  return (
    <FinderSection
      title={t("spotlight.goto")}
      rolesRequired={[]}
      items={[
        {
          icon: <Shapes size={16} />,
          title: t("navbar.your_courses"),
          item: {},
          onSelect: () => setPage("COURSES"),
        },
        ...(user.institution?.hasModeratorRole
          ? [
              {
                icon: <ListTree size={16} />,
                title: t("navbar.administration"),
                item: {},
                onSelect: () => setPage("STRUCTURE"),
              },
            ]
          : []),
        ...(user.institution?.hasAdminRole
          ? [
              {
                icon: <Users size={16} />,
                title: t("navbar.user_management"),
                item: {},
                onSelect: () => setPage("USERMANAGEMENT"),
              },
            ]
          : []),
        ...(user.institution?.hasAdminRole
          ? [
              {
                icon: <Settings size={16} />,
                title: t("navbar.organization_settings"),
                item: {},
                onSelect: () => setPage("ORGANIZATION_SETTINGS"),
              },
            ]
          : []),
      ]}
    />
  );
}
