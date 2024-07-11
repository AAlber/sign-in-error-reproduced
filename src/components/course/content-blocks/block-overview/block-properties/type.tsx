import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import contentBlockHandler from "@/src/client-functions/client-contentblock/handler";
import type { ContentBlock } from "@/src/types/course.types";
import PropertyBox from "./property-box";

export default function PropertyType({ block }: { block: ContentBlock }) {
  const blockType = contentBlockHandler.get.registeredContentBlockByType(
    block.type,
  );
  const { t } = useTranslation("page");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <PropertyBox>
      <span>{blockType.style.icon}</span> {t(blockType.name)}
    </PropertyBox>
  );
}
