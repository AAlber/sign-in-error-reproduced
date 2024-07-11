import clsx from "clsx";
import { useTranslation } from "react-i18next";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/reusable/shadcn-ui/card";
import type { RegisteredContentBlock } from "@/src/types/content-block/types/cb-types";
import type { ContentBlock } from "@/src/types/course.types";
import { useDynamicDescription } from "./hooks/use-dynamic-description";

export const BlockPopoverHeader = ({
  block,
  disabled,
  registredBlock,
}: {
  block: ContentBlock;
  disabled?: boolean;
  registredBlock: RegisteredContentBlock;
}) => {
  const { t } = useTranslation("page");

  return (
    <CardHeader className="p-0">
      <CardTitle
        className={clsx(disabled && "text-muted-contrast/60", "text-lg")}
      >
        {block.name}
      </CardTitle>
      <CardDescription className={clsx(disabled && "text-muted-contrast/60")}>
        {useDynamicDescription(block, registredBlock)}
      </CardDescription>
    </CardHeader>
  );
};
