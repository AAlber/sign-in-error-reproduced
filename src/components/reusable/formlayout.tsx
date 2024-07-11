import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Label } from "@/src/components/reusable/shadcn-ui/label";
import { Button } from "./shadcn-ui/button";
import WithToolTip from "./with-tooltip";

const Form = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={classNames("grid w-full grid-cols-3 gap-4")}>
      {children}
    </div>
  );
};

const Item = ({
  label,
  description = "",
  extraInfo = "",
  children,
  align = "center",
  descriptionBelowChildren = false,
}: {
  label: string;
  description?: string;
  extraInfo?: string;
  children: React.ReactNode;
  align?: "top" | "center" | "bottom";
  descriptionBelowChildren?: boolean;
}) => {
  const { t } = useTranslation("page");
  return (
    <>
      <Label
        className={classNames(
          "col-span-1 flex flex-col gap-1",
          align === "center"
            ? "justify-center"
            : align === "top"
            ? "justify-start"
            : "justify-end",
        )}
      >
        <div className="relative flex w-full items-center gap-1">
          {t(label)}
          {description && !descriptionBelowChildren && (
            <WithToolTip text={description}>
              <Button variant={"ghost"} size={"iconSm"}>
                <HelpCircle className="h-3.5 w-3.5 text-muted-contrast" />
              </Button>
            </WithToolTip>
          )}
        </div>

        {extraInfo && (
          <span className="mt-2 text-xs font-normal italic text-muted-contrast">
            {t(extraInfo)}
          </span>
        )}
      </Label>
      <div className="col-span-2 flex items-center justify-end">
        {descriptionBelowChildren ? (
          <div>
            {children}
            <span className="text-xs font-normal text-muted-contrast">
              {t(description)}
            </span>
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
};
Item.displayName = "Item";

const SettingsSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="col-span-3 flex w-full select-none flex-col divide-y divide-border rounded-md border border-border bg-foreground">
      {children}
    </div>
  );
};
SettingsSection.displayName = "SettingsSection";

const SettingsItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid w-full grid-cols-3 gap-4 px-4 py-2">{children}</div>
  );
};
SettingsItem.displayName = "SettingsItem";

const ButtonSection = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="col-span-3 flex items-center justify-end gap-2">
      {children}
    </div>
  );
};

const FullWidthItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="col-span-3 flex flex-col gap-2">{children}</div>;
};
FullWidthItem.displayName = "FullWidthSection";

ButtonSection.displayName = "ButtonSection";

Form.Item = Item;
Form.ButtonSection = ButtonSection;
Form.FullWidthItem = FullWidthItem;
Form.SettingsSection = SettingsSection;
Form.SettingsItem = SettingsItem;

export default Form;
