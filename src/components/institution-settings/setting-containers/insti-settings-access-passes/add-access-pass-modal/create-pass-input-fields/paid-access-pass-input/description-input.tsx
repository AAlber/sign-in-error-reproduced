import { useTranslation } from "react-i18next";
import { Textarea } from "@/src/components/reusable/shadcn-ui/text-area";

export default function DescriptionInput({
  setDescription,
  description,
}: {
  setDescription: (value: string) => void;
  description: string;
}) {
  const { t } = useTranslation("page");
  return (
    <>
      <div className="my-2 flex w-[36%] gap-2 whitespace-nowrap text-sm text-contrast">
        {t("description")}
      </div>
      <Textarea
        name=""
        id=""
        placeholder={t("access_passes.description_tooltip")}
        maxLength={120}
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full min-w-0 grow rounded-md border border-input bg-transparent px-2 text-sm text-contrast placeholder:text-muted-contrast"
      />
    </>
  );
}
