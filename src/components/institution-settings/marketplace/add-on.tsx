import { useTranslation } from "react-i18next";
import {
  formatStripeDate,
  subscriptionIsBeingCancelled,
} from "@/src/client-functions/client-stripe/utils";
import classNames from "@/src/client-functions/client-utils";
import BetaBadge from "@/src/components/reusable/badges/beta";
import type {
  PaidAddOnInfo,
  PaidAddOnStatusInfo,
} from "@/src/utils/stripe-types";
import { Button } from "../../reusable/shadcn-ui/button";
import type { SettingId } from "../tabs";
import { useInstitutionSettings } from "../zustand";
import ActiveSwitch from "./active-switch";

interface AddOnProps {
  icon: JSX.Element;
  iconIsImage?: boolean;
  title: string;
  subtitle: string;
  active: boolean;
  onToggle: (checked: boolean) => void;
  settingsPage?: SettingId;
  beta?: boolean;
  paidAddOn?: PaidAddOnInfo;
  paidAddOnStatusInfo?: PaidAddOnStatusInfo;
}

export default function AddOn(props: AddOnProps) {
  const { paidAddOnStatusInfo } = props;
  const subscription = paidAddOnStatusInfo?.subscription;
  const { t } = useTranslation("page");
  const { setMenuContent } = useInstitutionSettings();

  const handleManage = () => {
    if (!props.settingsPage) return;
    setMenuContent({ id: props.settingsPage, title: props.title });
  };

  return (
    <div className="flex h-full flex-col rounded-md border border-border bg-foreground ">
      <div className="flex w-full flex-1 flex-col items-start justify-stretch ">
        <div className="flex w-full flex-col p-4">
          <div className="mb-3 flex items-center gap-3 text-lg font-medium text-contrast">
            {props.iconIsImage ? (
              <div className="-mb-1 h-9 w-9">{props.icon}</div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-gradient-to-bl from-foreground to-secondary shadow-sm ">
                {props.icon}
              </div>
            )}
          </div>
          <h1 className="flex items-center gap-1 text-contrast">
            {t(props.title)} {props.beta && <BetaBadge />}
          </h1>
          <p className="text-sm leading-6 text-muted-contrast">
            {t(props.subtitle)}
          </p>
        </div>
      </div>
      <div className="flex h-12 items-center justify-between border-t border-border py-2 pl-3 pr-5">
        <div className={classNames(!props.active && "opacity-0")}>
          {props.settingsPage && (
            <Button onClick={handleManage}>{t("manage")}</Button>
          )}
        </div>
        {subscription && subscriptionIsBeingCancelled(subscription!) && (
          <p className="p-1 text-xs  text-muted-contrast">
            {t("organization_settings.add_ons_cancel_text") +
              formatStripeDate(subscription?.current_period_end, true)}
          </p>
        )}
        <ActiveSwitch active={props.active} onToggle={props.onToggle} />
      </div>
    </div>
  );
}
