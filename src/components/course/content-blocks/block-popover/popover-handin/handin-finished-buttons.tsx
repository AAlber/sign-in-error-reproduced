import { useTranslation } from "react-i18next";
import { Button } from "@/src/components/reusable/shadcn-ui/button";

export const HandInFinishedButtons = ({
  fileUrl,
  setChangeFile,
}: {
  fileUrl: string;
  setChangeFile: (change: boolean) => void;
}) => {
  const { t } = useTranslation("page");

  return (
    <div className="mt-2 flex w-full flex-col items-center gap-2">
      <Button
        className="w-full"
        variant={"cta"}
        onClick={async () => {
          if (!fileUrl) return;
          const a = document.createElement("a");
          a.style.display = "none";
          a.download = fileUrl;
          a.target = "_blank";
          a.href = fileUrl;
          a.click();
        }}
      >
        {t("download")}
      </Button>
      <Button
        className="w-full"
        onClick={async () => {
          setChangeFile(true);
        }}
      >
        {t("general.change")}
      </Button>
    </div>
  );
};
