import { useTranslation } from "react-i18next";
import StructurePath from "@/src/components/reusable/layer-path";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";

export default function LayerSelectPathHoverCard({
  layer,
}: {
  layer: {
    id: string;
  };
}) {
  const { t } = useTranslation("page");

  return (
    <CardHeader className="space-y-0 p-0">
      <CardTitle className="text-sm">{t("structurepath")}</CardTitle>
      <CardDescription>
        <StructurePath
          layerId={layer.id}
          className="text-xs text-muted-contrast"
        />
      </CardDescription>
    </CardHeader>
  );
}
