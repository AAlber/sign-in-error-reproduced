import { useTranslation } from "react-i18next";
import structureHandler from "@/src/client-functions/client-administration/structure-handler";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";

export default function StructurePath({
  layerId,
  className = "",
}: {
  layerId: string;
  className?: string;
}) {
  const { t } = useTranslation("page");

  const { data, loading, error } = useAsyncData(
    () => structureHandler.get.layerPath(layerId),
    JSON.stringify(layerId),
  );

  return (
    <div className={className}>
      {loading && (
        <div className="text-muted-contrast">{t("general.loading")}</div>
      )}
      {error && (
        <div className="text-destructive">{t("error_loading_layerpath")}</div>
      )}
      {!loading && !error && data && (
        <div>{data.path.map((layerName) => layerName).join(" / ")}</div>
      )}
    </div>
  );
}
