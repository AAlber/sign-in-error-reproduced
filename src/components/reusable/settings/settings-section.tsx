import type { VariantProps } from "class-variance-authority";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import Spinner from "../../spinner";
import type { buttonVariants } from "../shadcn-ui/button";
import { Button } from "../shadcn-ui/button";

interface SettingsSectionProps {
  title?: string;
  subtitle?: string;
  noFooter?: boolean;
  loading?: boolean;
  bigContent?: boolean;
  footerButtonText?: string;
  footerButtonDisabled?: boolean;
  footerButtonAction?: () => Promise<any>;
  footerButtonVariant?: VariantProps<typeof buttonVariants>["variant"];
  additionalButton?: JSX.Element;
  children: React.ReactNode;
}

export default function SettingsSection(props: SettingsSectionProps) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("page");

  const variant = props.footerButtonVariant ? props.footerButtonVariant : "cta";

  const onButtonAction = async () => {
    if (props.noFooter) return;
    if (!props.footerButtonAction) return;
    if (props.footerButtonDisabled) return;
    setLoading(true);
    await props.footerButtonAction();
    setLoading(false);
  };

  return (
    <div
      className={classNames(
        !props.bigContent && "lg:grid-cols-3",
        "grid grid-cols-1 gap-x-10 gap-y-4 border-b border-border bg-foreground p-6",
      )}
    >
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold leading-7 text-contrast">
          {t(props.title!)}
          {props.loading && <Spinner size="w-6 h-6" />}{" "}
        </h2>
        {props.subtitle && (
          <p className="text-sm leading-6 text-muted-contrast">
            {t(props.subtitle)}
          </p>
        )}
      </div>
      <form className="flex flex-col justify-between md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">{props.children}</div>
        </div>
        {!props.noFooter && (
          <div className="mt-4 flex items-center justify-end gap-2">
            {props.additionalButton && props.additionalButton}
            <Button
              variant={props.footerButtonDisabled ? "default" : variant}
              onClick={onButtonAction}
              disabled={props.footerButtonDisabled || loading}
            >
              {t(loading ? "general.loading" : props.footerButtonText!)}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
