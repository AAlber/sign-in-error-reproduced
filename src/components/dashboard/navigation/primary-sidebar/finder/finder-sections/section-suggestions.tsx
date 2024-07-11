import { useTranslation } from "react-i18next";
import { CourseIcon } from "@/src/components/reusable/course-layer-icons";
import { useNavigation } from "../../../zustand";
import FinderSection from "../finder-section";
import useFinder from "../zustand";
import type { Suggestion } from "./zustand-suggestions";
import useSuggestions from "./zustand-suggestions";

export default function SectionSuggestions() {
  const { t } = useTranslation("page");
  const { suggestions } = useSuggestions();
  const { setOpen } = useFinder();
  const { navigateToTab, setPage } = useNavigation();

  return (
    <FinderSection<Suggestion>
      title={t("spotlight.suggestions")}
      rolesRequired={[]}
      items={suggestions.map((suggestion) => {
        return {
          icon: (
            <CourseIcon
              icon={suggestion.icon}
              className="h-5 w-5"
              height={25}
              width={25}
            />
          ),
          title: suggestion.name,
          item: suggestion,
          onSelect: () => {
            setOpen(false);
            setPage("COURSES");
            navigateToTab(suggestion.id);
          },
        };
      })}
    />
  );
}
