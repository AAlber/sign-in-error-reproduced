import { useTranslation } from "react-i18next";
import { Separator } from "./shadcn-ui/separator";

const SeparatorWithTitle = ({ title }: { title: string }) => {
  const { t } = useTranslation("page");
  return (
    <div className="flex w-full flex-col px-2">
        <Separator />
      <div className="mt-4 flex items-center gap-2 rounded-md text-xs font-medium text-muted-contrast">
        {t(title)}
      </div>
    </div>
  );
};

export { SeparatorWithTitle };
