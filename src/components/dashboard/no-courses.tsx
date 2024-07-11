import { Shapes } from "lucide-react";
import { useTranslation } from "react-i18next";
import useUser from "@/src/zustand/user";
import { EmptyState } from "../reusable/empty-state";
import { Button } from "../reusable/shadcn-ui/button";
import { useNavigation } from "./navigation/zustand";

export default function NoCourses() {
  const { t } = useTranslation("page");
  const { setPage } = useNavigation();
  const { user } = useUser();

  if (!user?.institution) return null;

  return (
    <div className="h-full w-full p-6">
      <EmptyState
        size="large"
        icon={Shapes}
        withBlurEffect
        title={
          user.institution.hasAdminRole
            ? "dashboard_no_courses_header_special"
            : "dashboard_no_courses_header"
        }
        description={
          user.institution.hasAdminRole
            ? "dashboard_no_courses_subtitle_special"
            : "dashboard_no_courses_subtitle"
        }
        className="rounded-lg border border-dashed border-muted-contrast/50"
      >
        {user.institution.hasAdminRole && (
          <>
            <div className="flex items-center gap-2 py-4">
              <Button variant="cta" onClick={() => setPage("STRUCTURE")}>
                {t("go_to_structure")}
              </Button>
            </div>
            <EmptyState.LearnTrigger triggerId="welcome-learn-menu" />
          </>
        )}
      </EmptyState>
    </div>
  );
}
