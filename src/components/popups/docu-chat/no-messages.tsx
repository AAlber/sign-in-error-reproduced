import { AISymbol } from "fuxam-ui";
import { useTranslation } from "react-i18next";

export default function DocuChatNoMessages() {
  const { t } = useTranslation("page");
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <AISymbol state="spinning" className="h-8 w-8" />
      <span className="mt-1 font-medium">{t("how-can-i-help")}</span>
      <span className="mx-5 text-sm text-muted-contrast">
        {t("use-docu-chat")}
      </span>
    </div>
  );
}
