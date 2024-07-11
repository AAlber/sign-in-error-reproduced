import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "../../reusable/shadcn-ui/input";
import useUserDropdownView from "./zustand";

export default function UserDropdownSearch() {
  const { search, setSearch } = useUserDropdownView();
  const { t } = useTranslation("page");

  return (
    <div className="relative mb-2">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="h-4 w-4 text-muted-contrast " />
      </div>
      <Input
        type="text"
        name="search"
        id="search"
        className="flex w-full items-center justify-start rounded-md px-3 text-sm text-contrast"
        placeholder={t("course_members_display_members_search_placeholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
