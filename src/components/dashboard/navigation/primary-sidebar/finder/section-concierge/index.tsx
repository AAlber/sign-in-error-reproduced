import { AISymbol } from "fuxam-ui";
import { useTranslation } from "react-i18next";
import FinderSection from "../finder-section";
import useFinder from "../zustand";

export default function SectionConcierge() {
  const { t } = useTranslation("page");
  const { setMode } = useFinder();

  return (
    <FinderSection
      title={t("artificial-intelligence")}
      rolesRequired={[]}
      items={[
        {
          icon: <AISymbol state="spinning" className="h-5 w-5" />,
          title: t("ask_the_concierge"),
          item: {},
          onSelect: () => setMode("chat"),
        },
      ]}
    />
  );
}
