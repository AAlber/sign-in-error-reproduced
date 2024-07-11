import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import classNames from "@/src/client-functions/client-utils";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Checkbox as ShadCnCheckbox } from "@/src/components/reusable/shadcn-ui/checkbox";
import { Label } from "@/src/components/reusable/shadcn-ui/label";

const FilterSection = ({
  children,
  align = "vertical",
}: {
  children: React.ReactNode;
  align?: "horizontal" | "vertical";
}) => {
  return (
    <div
      className={classNames(
        align === "vertical" ? "flex flex-col gap-2" : "grid grid-cols-2 gap-4",
      )}
    >
      {children}
    </div>
  );
};

const Header = ({ children }) => {
  return <Label className="flex flex-col">{children}</Label>;
};
Header.displayName = "Header";

const Title = ({ label }: { label: string }) => {
  const { t } = useTranslation("page");

  return <span className="font-medium text-contrast">{t(label)}</span>;
};
Title.displayName = "Title";

const Description = ({ label }: { label: string }) => {
  const { t } = useTranslation("page");

  return (
    <span className="text-xs font-normal leading-snug text-muted-contrast">
      {t(label)}
    </span>
  );
};
Description.displayName = "Description";

const CheckBoxGrid = ({ children }) => {
  return (
    <div className="mt-2 grid w-full grid-cols-2 gap-2 gap-y-4">{children}</div>
  );
};
const FilterCheckbox = ({
  label,
  radio = false,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  radio?: boolean;
  onChange: (checked: boolean) => void;
}) => {
  const { t } = useTranslation("page");
  return (
    <Button
      onClick={() => onChange(!checked)}
      variant={"ghost"}
      className="flex items-center justify-start gap-2 text-sm"
    >
      <ShadCnCheckbox
        className={classNames(radio && "rounded-full")}
        checked={checked}
        onCheckedChange={onChange}
      />
      <span>{t(label)}</span>
    </Button>
  );
};

const FilterSingleSelectOptions = ({ children }) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};

const FilterSingleSelectOption = ({
  icon,
  label,
  description,
  selected,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) => {
  const { t } = useTranslation("page");

  return (
    <button
      key={label}
      onClick={onSelect}
      className={classNames(
        "-mx-2 flex items-center justify-between space-x-4 rounded-md p-2 text-left transition-all hover:bg-accent/50",
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div className="ml-1 space-y-1">
          <p className="text-sm font-medium capitalize leading-none">
            {t(label)}
          </p>
          <p className="text-xs text-muted-contrast">{t(description)}</p>
        </div>
      </div>
      <Check
        className={classNames(
          !selected && "hidden",
          "h-4 w-6 text-accent-contrast",
        )}
      />
    </button>
  );
};

FilterSection.Header = Header;
FilterSection.Title = Title;
FilterSection.Description = Description;
FilterSection.CheckBoxGrid = CheckBoxGrid;
FilterSection.Checkbox = FilterCheckbox;
FilterSection.SingleSelectOptions = FilterSingleSelectOptions;
FilterSection.SingleSelectOption = FilterSingleSelectOption;

export default FilterSection;
