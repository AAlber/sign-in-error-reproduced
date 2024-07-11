import prettyBytes from "pretty-bytes";
import { useTranslation } from "react-i18next";

export default function StorageStatusWithLoader({
  title,
  size,
}: {
  title?: string;
  size?: number;
}) {
  const { t } = useTranslation("page");

  return (
    <div className="flex items-center gap-2 text-sm text-muted-contrast">
      {t(title || "")}:{" "}
      <span className="inline-block rounded-md  text-contrast">
        {prettyBytes(size || 0)}
      </span>
    </div>
  );
}
