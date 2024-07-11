import { AsyncCombobox } from "../../reusable/async-combobox";
import { AutoLayerCourseIconDisplay } from "../../reusable/course-layer-icons";
import { searchCourseUserHasSpecialAccessTo } from "./functions";
import useImportCourseDataModal from "./zustand";

export default function SearchCourseInput() {
  const { setSelectedLayerId, layerToImportFromId } =
    useImportCourseDataModal();

  return (
    <AsyncCombobox
      mode="select"
      fetchOptions={searchCourseUserHasSpecialAccessTo}
      selected={layerToImportFromId}
      onSelect={(id) => setSelectedLayerId(id || "")}
      searchPlaceholder="Search for a course"
      placeholder="Select a course"
      noOptionsPlaceholder={<>No courses</>}
      optionComponent={(course) => <CourseOption course={course} />}
      selectedComponent={(course) => <CourseOption course={course} />}
    />
  );
}

function CourseOption({ course }: { course: any }) {
  return (
    <div className="flex w-full items-center justify-start gap-3">
      <div className="flex items-center gap-3 font-medium text-contrast">
        <AutoLayerCourseIconDisplay course={course} width={20} height={20} />
        <span>{course.name}</span>
      </div>
    </div>
  );
}
