import { AlertOctagon, AlertTriangle, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast as sonnerToast } from "sonner";
import classNames, {
  replaceVariablesInString,
} from "@/src/client-functions/client-utils";
import Spinner from "../../spinner";
import { Button } from "../shadcn-ui/button";
import type { ToastResponseError, ToastTransactionData } from "./functions";
import { toastResponseError, toastTransaction } from "./functions";

type PromiseT<Data = any> = Promise<Data> | (() => Promise<Data>);

export type ToastSettings = {
  icon?: React.ReactNode;
  description?: string;
  duration?: number;
  important?: boolean;
  align?: "horizontal" | "vertical";
  descriptionAsComponent?: React.ReactNode;
  actionCTA?: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  };
  action?: {
    label: string;
    onClick?: () => void;
  };
  onToastClick?: () => Promise<void> | void;
  promise?: PromiseT;
  titleVariables?: string[];
  descriptionVariables?: string[];
};

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

function TranslatedToastIcon({ type }: { type: ToastType }) {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <Check className="h-5 w-5 text-positive" />,
    error: <AlertOctagon className="h-5 w-5 text-destructive" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <></>,
    loading: <Spinner size="h-5 w-5" />,
  };

  return <div className="mt-0.5">{icons[type]}</div>;
}

export function TranslatedToast({
  title,
  settings,
  type,
}: {
  title: string;
  settings: ToastSettings;
  type: ToastType;
}) {
  const { t } = useTranslation("page");

  const hasButtons = settings.actionCTA || settings.action;
  const hasBothButtons = settings.actionCTA && settings.action;
  const icon = settings.icon;
  const align = settings.align || "horizontal";

  const handleToastClick = () => {
    if (!settings.onToastClick) return;
    settings.onToastClick();
  };
  const {
    titleVariables,
    descriptionAsComponent,
    descriptionVariables,
    description,
  } = settings;

  return (
    <div className="grid grid-cols-5 gap-2">
      <div
        onClick={handleToastClick}
        className={classNames(
          align === "horizontal" && hasButtons ? "col-span-3" : "col-span-5",
          settings.onToastClick && "cursor-pointer",
          "flex w-full items-start gap-3 text-lg",
        )}
      >
        {icon ? (
          icon
        ) : type === "info" ? (
          <></>
        ) : (
          <TranslatedToastIcon type={type} />
        )}
        <div className="flex flex-col">
          <p className="w-full text-sm text-contrast">
            {titleVariables
              ? replaceVariablesInString(t(title), titleVariables)
              : t(title)}
          </p>
          {descriptionAsComponent
            ? descriptionAsComponent
            : description && (
                <p className="w-full text-sm text-muted-contrast ">
                  {descriptionVariables
                    ? replaceVariablesInString(
                        t(description),
                        descriptionVariables,
                      )
                    : t(description)}
                </p>
              )}
        </div>
      </div>
      {hasButtons && (
        <div
          className={classNames(
            align === "horizontal"
              ? "col-span-2 flex flex-col justify-center gap-2"
              : "col-span-5 mt-2 flex items-center justify-end gap-2",
          )}
        >
          {settings.actionCTA && (
            <Button
              size={hasBothButtons && "small"}
              variant={"default"}
              className="text-sm text-contrast"
              onClick={settings.actionCTA.onClick}
            >
              {t(settings.actionCTA.label)}
            </Button>
          )}
          {settings.action && (
            <Button
              size={hasBothButtons && "small"}
              className="text-sm text-contrast"
              onClick={settings.action.onClick}
            >
              {t(settings.action.label)}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export const toast = {
  success: (title: string, settings: ToastSettings) =>
    sonnerToast.message(
      <TranslatedToast title={title} settings={settings} type="success" />,
      { duration: settings.duration },
    ),
  error: (title: string, settings: ToastSettings) =>
    sonnerToast.message(
      <TranslatedToast title={title} settings={settings} type="error" />,
      { duration: settings.duration },
    ),
  warning: (title: string, settings: ToastSettings) =>
    sonnerToast.message(
      <TranslatedToast title={title} settings={settings} type="warning" />,
      { duration: settings.duration },
    ),
  info: (title: string, settings: ToastSettings) =>
    sonnerToast.message(
      <TranslatedToast title={title} settings={settings} type="info" />,
      { duration: settings.duration },
    ),
  loading: (title: string, settings: ToastSettings) =>
    sonnerToast.message(
      <TranslatedToast title={title} settings={settings} type="loading" />,
      { duration: settings.duration },
    ),
  custom: (Elem: React.FunctionComponent<{ toastId: string | number }>) =>
    sonnerToast.custom((t) => <Elem toastId={t} />, { duration: 6000 }),
  responseError: (data: ToastResponseError) => toastResponseError(data),
  transaction: (data: ToastTransactionData) => toastTransaction(data),
};
