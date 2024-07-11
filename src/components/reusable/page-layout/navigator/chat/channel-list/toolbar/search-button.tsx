import { useTranslation } from "react-i18next";
import useChat from "../../zustand";

export default function SearchButton() {
  const { isSearching, setIsSearching } = useChat();
  const { t } = useTranslation("page");

  if (isSearching) return null;
  return (
    <button
      className="group flex h-8 w-full grow cursor-text items-center space-x-1.5 rounded-md border border-border bg-foreground pl-3 text-left text-sm transition-colors"
      onClick={() => {
        setIsSearching();
      }}
    >
      <span className="text-muted">{t("general.search")}</span>
    </button>
  );
}
