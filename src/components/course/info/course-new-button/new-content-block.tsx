import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { toastNoSubscription } from "@/src/client-functions/client-stripe/alerts";
import { hasActiveSubscription } from "@/src/client-functions/client-stripe/data-extrapolation";
import classNames from "@/src/client-functions/client-utils";
import type { RegisteredContentBlock } from "@/src/types/content-block/types/cb-types";
import { log } from "@/src/utils/logger/logger";
import { DropdownMenuItem } from "../../../reusable/shadcn-ui/dropdown-menu";
import useContentBlockCreator from "../../content-blocks/content-block-creator/zustand";

export function NewContentBlock({ block }: { block: RegisteredContentBlock }) {
  const { openModal } = useContentBlockCreator();
  const { t } = useTranslation("page");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <DropdownMenuItem
      className={classNames(
        block.status === "comingsoon" && "cursor-not-allowed opacity-80",
      )}
      onClick={() => {
        log.click("User attempt to open block modal for" + block.name);
        if (!hasActiveSubscription()) return toastNoSubscription();
        if (block.status === "comingsoon") return;
        if (block.openCustomCreateModal) return block.openCustomCreateModal();
        // if block has no custom creation, open the default modal.
        openModal(block.type);
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background">
        <div className="flex w-[1.15rem] justify-center text-contrast">
          {block.style.icon}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          {t(block.name)}{" "}
          <span className="text-xs text-yellow-600 dark:text-yellow-400">
            {block.status === "comingsoon" && t("coming_soon")}
          </span>
          <span className="text-xs text-muted-contrast dark:text-muted-contrast">
            {block.status === "beta" && t("beta")}
          </span>
        </div>
        <span className="text-xs text-muted-contrast">
          {t(block.description)}
        </span>
      </div>
    </DropdownMenuItem>
  );
}
