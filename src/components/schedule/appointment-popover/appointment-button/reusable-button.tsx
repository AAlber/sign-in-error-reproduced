import type { VariantProps } from "class-variance-authority";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { buttonVariants } from "@/src/components/reusable/shadcn-ui/button";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import WithToolTip from "@/src/components/reusable/with-tooltip";

export const AppointmentButton = ({
  tooltipText,
  buttonText,
  showCopyButton,
  disableTooltip,
  disableButton,
  variant = "default",
  onClick,
  onCopyClick,
}: {
  tooltipText?: string;
  buttonText?: string;
  showCopyButton?: boolean;
  disableTooltip?: boolean;
  disableButton?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick?: () => void;
  onCopyClick?: () => void;
}) => {
  const [copyWasClicked, setCopyWasClicked] = useState(false);
  const { t } = useTranslation("page");

  return (
    <>
      <WithToolTip text={t(tooltipText || "")} disabled={disableTooltip}>
        <div className="mt-4 flex w-full items-center gap-2">
          <Button
            className="w-full"
            variant={variant}
            disabled={disableButton}
            onClick={onClick}
          >
            {t(buttonText || "")}
          </Button>
          {showCopyButton && (
            <Button
              variant={"default"}
              onClick={() => {
                setCopyWasClicked(true);
                onCopyClick && onCopyClick();
              }}
              disabled={disableButton}
            >
              {!copyWasClicked ? (
                <Copy className="h-4 w-4 " />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </WithToolTip>
    </>
  );
};
