import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { truncate } from "@/src/client-functions/client-utils";
import AsyncSelect from "../../../reusable/async-select";
import { AutoLayerCourseIconDisplay } from "../../../reusable/course-layer-icons";
import { Button } from "../../../reusable/shadcn-ui/button";
import usePlanner from "../zustand";
import SelectionWrapper from "./wrapper";

export default function CourseSelection() {
  const { course, setCourse } = usePlanner();
  const { t } = useTranslation("page");

  return (
    <>
      <SelectionWrapper
        title={t("planner.courses.title")}
        description={t("planner.courses.description")}
      >
        <AsyncSelect
          trigger={
            <Button className="flex w-full items-center justify-center gap-2">
              {course ? (
                <>
                  <AutoLayerCourseIconDisplay
                    course={course}
                    className="h-4 w-4"
                  />
                  <span> {truncate(course.name ?? "", 30)}</span>
                </>
              ) : (
                t("select_course")
              )}
            </Button>
          }
          fetchData={async () => structureHandler.get.coursesUserHasAccessTo()}
          placeholder="general.search"
          noDataMessage="general.empty"
          searchValue={(item) => item.name + " " + item.id}
          itemComponent={(item) => (
            <p className="flex w-full items-center gap-2">
              <AutoLayerCourseIconDisplay course={item} className="h-5 w-5" />
              <span> {truncate(item.name ?? "", 30)}</span>
            </p>
          )}
          onSelect={(item) => setCourse(item)}
        />
      </SelectionWrapper>
    </>
  );
}
