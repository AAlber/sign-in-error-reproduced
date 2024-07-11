import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useIntercom } from "react-use-intercom";
import { cn } from "@/src/utils/utils";
import { withPortal } from "../portal";
import FuxamBotLayout from "../reusable/fuxam-bot-layout";
import { Button } from "../reusable/shadcn-ui/button";

type ErrorDisplayProps = {
  onReset: () => Promise<void> | void;
  resetButtonText?: string;
};

function ErrorDisplay({ onReset, resetButtonText }: ErrorDisplayProps) {
  const { show } = useIntercom();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { t } = useTranslation("page");

  return (
    <div
      className={cn(
        "absolute inset-0 z-40 h-full w-full overflow-hidden rounded-md border border-border transition-opacity",
        isMounted ? "opacity-100" : "opacity-0",
      )}
    >
      <FuxamBotLayout state="error">
        <div className="space-y-4">
          <div>
            <p className="bg-gradient-to-t text-xl font-semibold leading-8 text-primary">
              {t("error_boundary_heading")}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-contrast sm:text-4xl">
              {t("error_boundary_subheading")}
            </h1>

            <p className="text-base leading-8 text-muted-contrast">
              {t("error_boundary_description")}
            </p>
          </div>

          <div className="space-x-4">
            <Button onClick={onReset}>{resetButtonText ?? "Reset"}</Button>
            <Button
              onClick={() => {
                show();
              }}
              variant="cta"
            >
              {t("error_boundary_contact_support")}
            </Button>
          </div>
        </div>
      </FuxamBotLayout>
    </div>
  );
}

export default withPortal(ErrorDisplay);
