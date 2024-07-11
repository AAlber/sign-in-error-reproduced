import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { AutoLayerCourseIconDisplay } from "@/src/components/reusable/course-layer-icons";
import { useNavigation } from "../../../zustand";
import AsyncFinderSection from "../async-finder-section";
import useFinder from "../zustand";

export default function SectionCourses() {
  const { t } = useTranslation("page");
  const { setOpen } = useFinder();
  const { navigateToTab, setPage } = useNavigation();

  return (
    <AsyncFinderSection
      title={t("spotlight.courses")}
      rolesRequired={[]}
      fetchItems={structureHandler.get.coursesUserHasAccessTo}
      renderItem={(course) => {
        return {
          icon: (
            <AutoLayerCourseIconDisplay course={course} className="size-5" />
          ),
          title: course.name,
          item: course,
          onSelect: () => {
            setOpen(false);
            setPage("COURSES");
            navigateToTab(course.layer_id);
          },
        };
      }}
    />
  );
}
