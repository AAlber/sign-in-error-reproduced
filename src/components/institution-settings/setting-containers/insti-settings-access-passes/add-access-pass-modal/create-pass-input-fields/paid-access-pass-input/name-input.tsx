import { useTranslation } from "react-i18next";
import { Input } from "@/src/components/reusable/shadcn-ui/input";

export default function NameInput({
  setName,
  name,
}: {
  setName: (value: string) => void;
  name: string;
}) {
  const { t } = useTranslation("page");
  return (
    <>
      <div className="whitespace-nowrap text-sm text-contrast">{t("name")}</div>
      <Input
        name=""
        id=""
        placeholder={t("access_passes.name_tooltip")}
        maxLength={80}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-2 block w-full min-w-0 grow rounded-md border border-input bg-transparent px-2 text-sm text-contrast placeholder:text-muted-contrast"
      />
    </>
  );
}
