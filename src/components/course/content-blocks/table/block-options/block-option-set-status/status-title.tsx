import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";

type Props = {
  activeStatusColor: string;
};

export default function StatusTitle({ activeStatusColor }: Props) {
  const { t } = useTranslation("page");
  return (
    <>
      <div className={classNames("flex h-4 w-4 items-center justify-center")}>
        <div
          className={classNames("h-2 w-2 rounded-full", activeStatusColor)}
        />
      </div>
      <span className="text-sm text-contrast">
        {t("course_main_content_block_status")}
      </span>
    </>
  );
}
