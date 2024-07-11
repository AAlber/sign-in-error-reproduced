import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import Input from "@/src/components/reusable/input";
import useElementLibrary from "./zustand";

export default function ElementLibrarySearch() {
  const { search, setSearch } = useElementLibrary();
  const { t } = useTranslation("page");

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="h-4 w-4 text-muted-contrast text-opacity-80" />
      </div>
      <Input
        placeholder={t("workbench.sidebar_search_input_placeholder")}
        text={search}
        setText={(text) => setSearch(text)}
      />
    </div>
  );
}
